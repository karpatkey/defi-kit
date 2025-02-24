import { eth } from "."
import { wallets } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { eth as kit } from "../../../test/kit"
import { parseEther } from "ethers"
import { Chain } from "../../../src"

const METAMORPHO_VAULT = "0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658" // gtLRTcore Vault address
const STEAL_ADDRESS = "0xa1E2481a9CD0Cb0447EeB1cbc26F1b3fff3bec20" // Address to fund test WETH
const underlying = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" // WETH

describe("Morpho Protocol", () => {
  describe("Deposit Action", () => {
    beforeAll(async () => {
      await applyPermissions(
        Chain.eth,
        await eth.deposit({ targets: ["gtLRTcore"] })
      )
    })

    it("deposit WETH", async () => {
      const amount = parseEther("2")

      await stealErc20(Chain.eth, underlying, amount, STEAL_ADDRESS)
      await kit.asAvatar.weth
        .attach(underlying)
        .approve(METAMORPHO_VAULT, amount)
      await expect(
        kit.asMember.morpho.metaMorpho
          .attach(METAMORPHO_VAULT)
          .deposit(amount, wallets.avatar)
      ).not.toRevert()
    })

    it("mint ", async () => {
      const amount = parseEther("1")
      const shareAmount = await kit.asAvatar.morpho.metaMorpho.convertToShares(
        amount / 2n
      )

      await stealErc20(Chain.eth, underlying, amount, STEAL_ADDRESS)
      await kit.asAvatar.weth
        .attach(underlying)
        .approve(METAMORPHO_VAULT, amount)
      await expect(
        kit.asMember.morpho.metaMorpho
          .attach(METAMORPHO_VAULT)
          .mint(shareAmount, wallets.avatar)
      ).not.toRevert()
    })

    it("withdraw ", async () => {
      const amount = parseEther("1")

      await stealErc20(Chain.eth, underlying, amount, STEAL_ADDRESS)
      await kit.asAvatar.weth
        .attach(underlying)
        .approve(METAMORPHO_VAULT, amount)
      console.log("address avatar = ", wallets.avatar)
      console.log(
        "balance before withdraw = ",
        await kit.asAvatar.morpho.metaMorpho
          .attach(METAMORPHO_VAULT)
          .balanceOf(wallets.avatar)
      )
      await expect(
        kit.asMember.morpho.metaMorpho
          .attach(METAMORPHO_VAULT)
          .withdraw(amount, wallets.avatar, wallets.avatar)
      ).not.toRevert()
    })

    it("redeem ", async () => {
      const amount = parseEther("1")
      const shareAmount = await kit.asAvatar.morpho.metaMorpho.convertToShares(
        amount / 2n
      )

      await stealErc20(Chain.eth, underlying, amount, STEAL_ADDRESS)
      await kit.asAvatar.weth
        .attach(underlying)
        .approve(METAMORPHO_VAULT, amount)
      await expect(
        kit.asMember.morpho.metaMorpho
          .attach(METAMORPHO_VAULT)
          .redeem(shareAmount, wallets.avatar, wallets.avatar)
      ).not.toRevert()
    })
  })
})
