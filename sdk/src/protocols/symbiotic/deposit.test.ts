import { eth } from "."
import { wallets } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { eth as kit } from "../../../test/kit"
import _ethPools from "./_ethPools"
import { parseEther } from "ethers"
import { Chain } from "../../../src"

const stealAddress = "0x3c22ec75ea5D745c78fc84762F7F1E6D82a2c5BF"
const defaultCollateral = "0xC329400492c6ff2438472D4651Ad17389fCb843a" //wstETHPool
const underlying = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0" //wstETH token
const stETHToken = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
const stealAddress1 = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"

describe("symbiotic", () => {
  describe("deposit action", () => {
    beforeAll(async () => {
      await applyPermissions(
        Chain.eth,
        await eth.deposit({ targets: ["wstETH"] })
      )
    })

    it("deposit", async () => {
      const amount = parseEther("10")
      await stealErc20(Chain.eth, underlying, amount, stealAddress)
      await kit.asMember.weth
        .attach(underlying)
        .approve(defaultCollateral, amount)
      await expect(
        kit.asMember.symbiotic.defaultCollateral
          .attach(defaultCollateral)
          ["deposit(address,uint256)"](wallets.avatar, amount)
      ).not.toRevert()
    })

    it("wrap stETH", async () => {
      const amount = parseEther("10")
      await stealErc20(Chain.eth, stETHToken, amount, stealAddress1)
      await expect(
        kit.asMember.lido.stEth.approve(underlying, amount)
      ).not.toRevert()
      await expect(kit.asMember.lido.wstEth.wrap(amount)).not.toRevert()
    })

    it("withdraw", async () => {
      const amount = parseEther("10")
      await stealErc20(Chain.eth, underlying, amount, stealAddress)
      await kit.asMember.weth
        .attach(underlying)
        .approve(defaultCollateral, amount)
      await expect(
        kit.asMember.symbiotic.defaultCollateral
          .attach(defaultCollateral)
          ["deposit(address,uint256)"](wallets.avatar, amount)
      ).not.toRevert()
      await expect(
        kit.asMember.symbiotic.defaultCollateral
          .attach(defaultCollateral)
          .withdraw(wallets.avatar, amount)
      ).not.toRevert()
    })
  })
})
