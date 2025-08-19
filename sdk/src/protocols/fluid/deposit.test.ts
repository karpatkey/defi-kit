import { eth } from "."
import { wallets } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { eth as kit } from "../../../test/kit"
import { parseEther } from "ethers"
import { Chain } from "../../../src"

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
      await expect(
        kit.asMember.fluid.fWeth["withdrawNative(uint256,address,address)"](
          parseEther("1"),
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
      await expect(
        kit.asMember.fluid.fWeth["withdraw(uint256,address,address)"](
          parseEther("1"),
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

    // Claim rewards to avatar
    it("only claim rewards to avatar", async () => {
      await expect(
        kit.asMember.fluid.merkleDistributor.claim(
          wallets.avatar,
          1,
          1,
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          1,
          [
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          ],
          "0x"
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.fluid.merkleDistributor.claim(
          wallets.member,
          1,
          1,
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          1,
          [
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          ],
          "0x"
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
