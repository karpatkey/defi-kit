import { eth } from "../../../v2/index"
import { wallets } from "../../../../../../test/wallets"
import {
  applyPermissions,
  stealErc20,
  advanceTime,
} from "../../../../../../test/helpers"
import { contracts } from "../../../../../../eth-sdk/config"
import { Status } from "../../../../../../test/types"
import { eth as kit } from "../../../../../../test/kit"
import { parseEther } from "ethers"
import { Chain } from ".../../../src"

describe("aaveV3", () => {
  describe("stake", () => {
    beforeAll(async () => {
      await applyPermissions(
        Chain.eth,
        await eth.stake({ targets: ["AAVE", "ABPTV2", "GHO"] })
      )
    })

    it("stake AAVE", async () => {
      await stealErc20(
        Chain.eth,
        contracts.mainnet.aaveV3.aave,
        parseEther("1"),
        contracts.mainnet.balancerV2.vault
      )

      await expect(
        kit.asMember.aaveV3.aave.approve(
          contracts.mainnet.aaveV3.stkAave,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.stkAave.stake(wallets.avatar, parseEther("1"))
      ).not.toRevert()

      await advanceTime(Chain.eth, 2)
      await expect(
        kit.asMember.aaveV3.stkAave.claimRewards(wallets.avatar, 1)
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.stkAave.claimRewardsAndStake(wallets.avatar, 1)
      ).not.toRevert()

      await expect(kit.asMember.aaveV3.stkAave.cooldown()).not.toRevert()

      // The 7 days cooldown period must pass in order to withdraw the AAVE.
      await advanceTime(Chain.eth, 605000)
      await expect(
        kit.asMember.aaveV3.stkAave.redeem(wallets.avatar, 1)
      ).not.toRevert()
      await expect(
        kit.asMember.aaveV3.stkAave.claimRewardsAndStake(wallets.avatar, 1)
      ).not.toRevert()
      await expect(
        kit.asMember.aaveV3.stkAave.claimRewards(wallets.avatar, 1)
      ).not.toRevert()
    })

    it("only allows staking and claiming AAVE from avatar", async () => {
      await expect(
        kit.asMember.aaveV3.stkAave.stake(wallets.member, parseEther("1"))
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        kit.asMember.aaveV3.stkAave.claimRewardsAndStake(wallets.member, 1)
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        kit.asMember.aaveV3.stkAave.claimRewards(wallets.member, 1)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("stake ABPT", async () => {
      await stealErc20(
        Chain.eth,
        contracts.mainnet.aaveV3.abptV2,
        parseEther("1"),
        contracts.mainnet.aaveV3.stkAbptV2
      )

      await expect(
        kit.asMember.aaveV3.abptV2.approve(
          contracts.mainnet.aaveV3.stkAbptV2,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.stkAbptV2.stake(wallets.avatar, parseEther("1"))
      ).not.toRevert()

      await advanceTime(Chain.eth, 2)
      await expect(
        kit.asMember.aaveV3.stkAbptV2.claimRewards(wallets.avatar, 1)
      ).toBeAllowed() // Replaced not.toRevert() with toBeAllowed().

      await expect(kit.asMember.aaveV3.stkAbptV2.cooldown()).not.toRevert()

      // The 20 days cooldown period must pass in order to withdraw the ABPT V2.
      await advanceTime(Chain.eth, 1730000)
      await expect(
        kit.asMember.aaveV3.stkAbptV2.redeem(wallets.avatar, 1)
      ).not.toRevert()
      await expect(
        kit.asMember.aaveV3.stkAbptV2.claimRewards(wallets.avatar, 1)
      ).toBeAllowed() // Replaced not.toRevert() with toBeAllowed().
    })

    it("only allows staking ABPT and claiming AAVE from avatar", async () => {
      await expect(
        kit.asMember.aaveV3.stkAbptV2.stake(wallets.member, parseEther("1"))
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        kit.asMember.aaveV3.stkAbptV2.claimRewards(wallets.member, 1)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("stake GHO", async () => {
      await stealErc20(
        Chain.eth,
        contracts.mainnet.aaveV3.gho,
        parseEther("1"),
        contracts.mainnet.balancerV2.vault
      )

      await expect(
        kit.asMember.aaveV3.gho.approve(
          contracts.mainnet.aaveV3.stkGho,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.stkGho.stake(wallets.avatar, parseEther("1"))
      ).not.toRevert()

      await advanceTime(Chain.eth, 2)
      await expect(
        kit.asMember.aaveV3.stkGho.claimRewards(wallets.avatar, 1)
      ).toBeAllowed() // Replaced not.toRevert() with toBeAllowed().

      await expect(kit.asMember.aaveV3.stkGho.cooldown()).not.toRevert()

      // GHO can be instantly redeemed.
      await expect(
        kit.asMember.aaveV3.stkGho.redeem(wallets.avatar, 1)
      ).not.toRevert()
      await expect(
        kit.asMember.aaveV3.stkGho.claimRewards(wallets.avatar, 1)
      ).toBeAllowed() // Replaced not.toRevert() with toBeAllowed().
    })

    it("only allows staking GHO and claiming AAVE from avatar", async () => {
      await expect(
        kit.asMember.aaveV3.stkGho.stake(wallets.member, parseEther("1"))
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        kit.asMember.aaveV3.stkGho.claimRewards(wallets.member, 1)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
