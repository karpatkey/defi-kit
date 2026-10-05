import { id, solidityPackedKeccak256 } from "ethers"
import { eth } from "."
import { wallets } from "../../../test/wallets"
import { applyPermissions } from "../../../test/helpers"
import { getProvider } from "../../../test/provider"
import { contracts } from "../../../eth-sdk/config"
import { eth as kit } from "../../../test/kit"
import { Chain } from "../../../src"

describe("cowSwap", () => {
  describe("swap appData & fee scoping", () => {
    const allowedAppDataDoc = '{"version":"0.9.0","metadata":{}}'
    const allowedAppData = solidityPackedKeccak256(
      ["string"],
      [allowedAppDataDoc]
    ) as `0x${string}`

    // A second legitimate document, so the permission pins an array and the
    // `oneOf` -> `Or` branch is exercised rather than the single-value `eq`.
    const secondAppData = solidityPackedKeccak256(
      ["string"],
      ['{"version":"1.1.0","metadata":{}}']
    ) as `0x${string}`

    // Same order shape, but its app data document carries a partner fee that
    // routes 100 bps of volume to an address the member controls.
    const partnerFeeAppData = solidityPackedKeccak256(
      ["string"],
      [
        '{"version":"0.9.0","metadata":{"partnerFee":{"bps":100,"recipient":"0x1111111111111111111111111111111111111111"}}}',
      ]
    ) as `0x${string}`

    const testOrder = {
      sellToken: contracts.mainnet.usdc,
      buyToken: contracts.mainnet.weth,
      receiver: "", // set in beforeAll
      sellAmount: "96825924243465932",
      buyAmount: "474505929366652675891",
      validTo: 0, // set in beforeAll
      appData: allowedAppData,
      feeAmount: "0",
      kind: id("sell"),
      partiallyFillable: false,
      sellTokenBalance: id("erc20"),
      buyTokenBalance: id("erc20"),
    }
    const testOrderValidDuration = 60 * 30 // 30 min

    beforeAll(async () => {
      await applyPermissions(
        Chain.eth,
        await eth.swap({
          sell: [contracts.mainnet.usdc],
          buy: [contracts.mainnet.weth],
          appData: [allowedAppData, secondAppData],
          // `feeAmountBp` deliberately omitted: it must default to 0.
        })
      )

      const provider = getProvider(Chain.eth)
      const block = await provider.getBlock("latest")

      testOrder.receiver = wallets.avatar
      // `signOrder` requires validTo to be *strictly* below
      // `block.timestamp + validDuration`. Using the full duration puts it
      // exactly on the boundary, which then only passes if a second happens
      // to elapse before the tx is mined. Keep a margin so this is deterministic.
      testOrder.validTo = block!.timestamp + testOrderValidDuration - 60
    })

    it("allows signing an order carrying the pinned appData", async () => {
      await expect(
        kit.asMember.cowSwap.orderSigner.signOrder.delegateCall(
          testOrder,
          testOrderValidDuration,
          0
        )
      ).not.toRevert()
    })

    it("allows either pinned appData, not just the first", async () => {
      await expect(
        kit.asMember.cowSwap.orderSigner.signOrder.delegateCall(
          { ...testOrder, appData: secondAppData },
          testOrderValidDuration,
          0
        )
      ).not.toRevert()
    })

    it("forbids an order whose appData routes a partner fee elsewhere", async () => {
      await expect(
        kit.asMember.cowSwap.orderSigner.signOrder.delegateCall(
          { ...testOrder, appData: partnerFeeAppData },
          testOrderValidDuration,
          0
        )
      ).toBeForbidden()
    })

    // 0x00..00 is the legacy "no appData" sentinel, not the keccak of any
    // document, so it is worth asserting separately from an arbitrary hash.
    it("forbids any other appData, including the zero sentinel", async () => {
      await expect(
        kit.asMember.cowSwap.orderSigner.signOrder.delegateCall(
          {
            ...testOrder,
            appData:
              "0x0000000000000000000000000000000000000000000000000000000000000000",
          },
          testOrderValidDuration,
          0
        )
      ).toBeForbidden()
    })

    it("defaults feeAmountBP to 0, forbidding a member-chosen fee cap", async () => {
      await expect(
        kit.asMember.cowSwap.orderSigner.signOrder.delegateCall(
          testOrder,
          testOrderValidDuration,
          535
        )
      ).toBeForbidden()

      // The extreme case this closes: 10000 bps lets feeAmount equal the whole
      // sellAmount.
      await expect(
        kit.asMember.cowSwap.orderSigner.signOrder.delegateCall(
          testOrder,
          testOrderValidDuration,
          10000
        )
      ).toBeForbidden()
    })
  })
})
