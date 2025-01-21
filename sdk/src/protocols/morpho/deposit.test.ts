import { eth } from "."
import { avatar } from "../../../test/wallets"
import { contracts } from "../../../eth-sdk/config"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { eth as kit } from "../../../test/kit"
import { parseEther } from "ethers"

// Test constants
const METAMORPHO_VAULT = "0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658" // gtLRTcore Vault address 
const STEAL_ADDRESS = "0xD48573cDA0fed7144f2455c5270FFa16Be389d04" // Address to fund test WETH
const underlying = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" // WETH

describe("Morpho Protocol", () => {
  describe("Deposit Action", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit({ targets: ["gtLRTcore"] }))
    })

    it("deposit WETH", async () => {
      const amount = parseEther("2")

      await stealErc20(underlying, amount, STEAL_ADDRESS)
      await kit.asAvatar.weth
        .attach(underlying)
        .approve(METAMORPHO_VAULT, amount)
      await expect(
        kit.asMember.morpho.metaMorpho.attach(METAMORPHO_VAULT).
        deposit(amount, avatar.address)
      ).not.toRevert()
    })

    it("mint ", async () => {
      const amount = parseEther("1")
      const shareAmount = await kit.asAvatar.morpho.metaMorpho.convertToShares(amount/2n)// Test with 0.76 WETH

      await stealErc20(underlying, amount, STEAL_ADDRESS)
      await kit.asAvatar.weth
        .attach(underlying)
        .approve(METAMORPHO_VAULT, amount)
      await expect(
        kit.asMember.morpho.metaMorpho.attach(METAMORPHO_VAULT).
        mint(shareAmount, avatar.address)
      ).not.toRevert()
    })

    it("withdraw ", async () => {
      const amount = parseEther("1")

      await stealErc20(underlying, amount, STEAL_ADDRESS)
      await kit.asAvatar.weth
        .attach(underlying)
        .approve(METAMORPHO_VAULT, amount)
      console.log("address avatar = ", avatar.address)
      console.log("balance before withdraw = ", await kit.asAvatar.morpho.metaMorpho.attach(METAMORPHO_VAULT).balanceOf(avatar.address))
      await expect(
        kit.asMember.morpho.metaMorpho.attach(METAMORPHO_VAULT).
        withdraw(amount, avatar.address, avatar.address)
      ).not.toRevert()
    })

    it("redeem ", async () => {
      const amount = parseEther("1")
      const shareAmount = await kit.asAvatar.morpho.metaMorpho.convertToShares(amount/2n)// Test with 0.76 WETH

      await stealErc20(underlying, amount, STEAL_ADDRESS)
      await kit.asAvatar.weth
        .attach(underlying)
        .approve(METAMORPHO_VAULT, amount)
      await expect(
        kit.asMember.morpho.metaMorpho.attach(METAMORPHO_VAULT).
        redeem(shareAmount, avatar.address, avatar.address)
      ).not.toRevert()
    })
  })
})
