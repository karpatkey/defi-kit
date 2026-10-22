import { eth } from "."
import { wallets } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { eth as kit } from "../../../test/kit"
import { Contract, parseEther } from "ethers"
import { Chain } from "../../../src"
import { getProvider } from "../../../test/provider"

describe("fluid", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(
        Chain.eth,
        await eth.deposit({ targets: ["ETH", "WETH"] })
      )
    })

    // Test with ETH
    it("only allows depositing ETH on behalf of avatar", async () => {
      await expect(
        kit.asMember.fluid.fWeth["depositNative(address)"](wallets.avatar, {
          value: parseEther("1"),
        })
      ).not.toRevert()

      await expect(
        kit.asMember.fluid.fWeth["depositNative(address)"](wallets.member, {
          value: parseEther("1"),
        })
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows withdrawing ETH from avatars' position", async () => {
      // Depositing exactly 1 ETH mints shares worth 1e18 - 1: the vault rounds
      // the deposit down. Withdrawing a hardcoded `parseEther("1")` therefore
      // asks for one wei more than the position holds and reverts. Derive the
      // amount instead, so this tests "exit the whole position" rather than
      // sitting on a rounding boundary.
      const withdrawable = await new Contract(
        contracts.mainnet.fluid.fWeth,
        ["function maxWithdraw(address) view returns (uint256)"],
        getProvider(Chain.eth)
      ).maxWithdraw(wallets.avatar)

      await expect(
        kit.asMember.fluid.fWeth["withdrawNative(uint256,address,address)"](
          withdrawable,
          wallets.avatar,
          wallets.avatar
        )
      ).not.toRevert()

      await expect(
        kit.asMember.fluid.fWeth["withdrawNative(uint256,address,address)"](
          parseEther("1"),
          wallets.member,
          wallets.member
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    // Test with WETH
    it("only allows depositing WETH on behalf of avatar", async () => {
      await stealErc20(
        Chain.eth,
        contracts.mainnet.weth,
        parseEther("1"),
        contracts.mainnet.balancerV2.vault
      )
      await expect(
        kit.asMember.weth.approve(
          contracts.mainnet.fluid.fWeth,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.fluid.fWeth["deposit(uint256,address)"](
          parseEther("1"),
          wallets.avatar
        )
      ).not.toRevert()

      await expect(
        kit.asMember.fluid.fWeth["deposit(uint256,address)"](
          parseEther("1"),
          wallets.member
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows withdrawing WETH from avatars' position", async () => {
      // Same rounding boundary as the ETH case above — derive the amount.
      const withdrawable = await new Contract(
        contracts.mainnet.fluid.fWeth,
        ["function maxWithdraw(address) view returns (uint256)"],
        getProvider(Chain.eth)
      ).maxWithdraw(wallets.avatar)

      await expect(
        kit.asMember.fluid.fWeth["withdraw(uint256,address,address)"](
          withdrawable,
          wallets.avatar,
          wallets.avatar
        )
      ).not.toRevert()

      await expect(
        kit.asMember.fluid.fWeth["withdraw(uint256,address,address)"](
          parseEther("1"),
          wallets.member,
          wallets.member
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
