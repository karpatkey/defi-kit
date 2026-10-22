import { parseUnits } from "ethers"
import { eth } from "."
import { wallets } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { eth as kit } from "../../../test/kit"
import { Chain } from "../../../src"

// Regression test for the SKY_sUSDS exit through the PSM router.
//
// `withdrawAndSwap`/`redeemAndSwap` pull the router's immutable `savingsToken()`,
// which is sUSDS. The permission used to approve sUSDC ("Spark USDC Vault", an
// unrelated vault) instead, so the exit could never be used through a role: the
// approval the router needs was forbidden, and the swap reverted with
// `SUsds/insufficient-allowance`.
describe("spark", () => {
  describe("SKY_sUSDS PSM exit", () => {
    beforeAll(async () => {
      await applyPermissions(
        Chain.eth,
        await eth.deposit({ targets: ["SKY_sUSDS"] })
      )

      // Fund the avatar with USDS from the sUSDS vault itself, then enter the
      // savings token through the permissions under test.
      await stealErc20(
        Chain.eth,
        contracts.mainnet.spark.usds,
        parseUnits("10000", 18),
        contracts.mainnet.spark.sUsds
      )
      await kit.asMember.spark.usds.approve(
        contracts.mainnet.spark.sUsds,
        parseUnits("10000", 18)
      )
      await kit.asMember.spark.sUsds["deposit(uint256,address,uint16)"](
        parseUnits("10000", 18),
        wallets.avatar,
        0
      )
    })

    it("allows approving sUSDS to the PSM router", async () => {
      await expect(
        kit.asMember.spark.sUsds.approve(
          contracts.mainnet.spark.psmUsdcSusds,
          parseUnits("10000", 18)
        )
      ).not.toRevert()
    })

    it("no longer grants an sUSDC approval to the PSM router", async () => {
      await expect(
        kit.asMember.spark.sUsdc.approve(
          contracts.mainnet.spark.psmUsdcSusds,
          parseUnits("10000", 18)
        )
      ).toBeForbidden()
    })

    it("allows withdrawAndSwap to the avatar", async () => {
      await expect(
        kit.asMember.spark.psmUsdcSusds.withdrawAndSwap(
          wallets.avatar,
          parseUnits("100", 6), // amountOut, USDC
          parseUnits("200", 18) // maxAmountIn, sUSDS
        )
      ).not.toRevert()
    })

    it("allows redeemAndSwap to the avatar", async () => {
      await expect(
        kit.asMember.spark.psmUsdcSusds.redeemAndSwap(
          wallets.avatar,
          parseUnits("100", 18), // shares, sUSDS
          0 // minAmountOut
        )
      ).not.toRevert()
    })

    it("still forbids routing the proceeds anywhere but the avatar", async () => {
      await expect(
        kit.asMember.spark.psmUsdcSusds.withdrawAndSwap(
          wallets.member,
          parseUnits("100", 6),
          parseUnits("200", 18)
        )
      ).toBeForbidden()
    })
  })
})
