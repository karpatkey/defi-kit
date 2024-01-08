import { ethers } from "ethers"
import { eth } from "."
import { avatar } from "../../../test/wallets"
import { applyPermissions } from "../../../test/helpers"
import { solidityKeccak256 } from "ethers/lib/utils"
import { testKit } from "../../../test/kit"
import { getProvider } from "../../../test/provider"
import { contracts } from "../../../eth-sdk/config"

describe("cowswap", () => {
  describe("swap", () => {
    const appData = '{"version":"0.9.0","metadata":{}}'
    const testOrder = {
      sellToken: contracts.mainnet.usdc,
      buyToken: contracts.mainnet.weth,
      receiver: "", // set in beforeAll
      sellAmount: "96825924243465932",
      buyAmount: "474505929366652675891",
      validTo: 0, // set in beforeAll
      appData: solidityKeccak256(["string"], [appData]),
      feeAmount: "19174075756534068",
      kind: ethers.utils.id("sell"),
      partiallyFillable: false,
      sellTokenBalance: ethers.utils.id("erc20"),
      buyTokenBalance: ethers.utils.id("erc20"),
    }
    let testOrderFeeAmountBP = Math.ceil(
      (parseInt(testOrder.feeAmount) / parseInt(testOrder.sellAmount)) * 10000
    ) // = 535 bps
    const testOrderValidDuration = 60 * 30 // 30 min

    beforeAll(async () => {
      await applyPermissions(
        await eth.swap({
          sell: [contracts.mainnet.usdc],
          buy: [contracts.mainnet.weth],
        })
      )

      const provider = getProvider()
      const block = await provider.getBlock("latest")

      testOrder.receiver = await avatar.getAddress()
      testOrder.validTo = block.timestamp + testOrderValidDuration
    })

    it("it only allows swapping the specified token pair", async () => {
      await expect(
        testKit.eth.cowswap.orderSigner.delegateCall.signOrder(
          testOrder,
          testOrderValidDuration,
          testOrderFeeAmountBP
        )
      ).not.toRevert()

      await expect(
        testKit.eth.cowswap.orderSigner.delegateCall.signOrder(
          {
            ...testOrder,
            sellToken: contracts.mainnet.weth,
            buyToken: contracts.mainnet.usdc,
          },
          testOrderValidDuration,
          testOrderFeeAmountBP
        )
      ).toBeForbidden()
    })

    it("allows cancelling orders", async () => {
      await expect(
        testKit.eth.cowswap.orderSigner.delegateCall.unsignOrder(testOrder)
      ).not.toRevert()
    })
  })
})
