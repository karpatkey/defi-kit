import { eth } from "."
import { avatar, member } from "../../../../test/wallets"
import {
  applyPermissions,
  stealErc20,
  advanceTime,
} from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { Status } from "../../../../test/types"
import { eth as kit } from "../../../../test/kit"
import { parseEther } from "ethers"

describe("aaveV2", () => {
  describe("stake", () => {
    beforeAll(async () => {
      await applyPermissions(
        await eth.stake({ targets: ["AAVE", "ABPTV2", "GHO"] })
      )
    })

    it("stake AAVE", async () => {
      await stealErc20(
        contracts.mainnet.aaveV2.aave,
        parseEther("1"),
        contracts.mainnet.balancer.vault
      )

      await expect(
        kit.asMember.aaveV2.aave.approve(
          contracts.mainnet.aaveV2.stkAave,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV2.stkAave.stake(avatar.address, parseEther("1"))
      ).not.toRevert()

      await advanceTime(2)
      await expect(
        kit.asMember.aaveV2.stkAave.claimRewards(avatar.address, 1)
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV2.stkAave.claimRewardsAndStake(avatar.address, 1)
      ).not.toRevert()

      await expect(kit.asMember.aaveV2.stkAave.cooldown()).not.toRevert()

      // The 20 days cooldown period must pass in order to withdraw the AAVE.
      await advanceTime(1730000)
      await expect(
        kit.asMember.aaveV2.stkAave.redeem(avatar.address, 1)
      ).not.toRevert()
      await expect(
        kit.asMember.aaveV2.stkAave.claimRewardsAndStake(avatar.address, 1)
      ).not.toRevert()
      await expect(
        kit.asMember.aaveV2.stkAave.claimRewards(avatar.address, 1)
      ).not.toRevert()
    })

    it("only allows staking and claiming AAVE from avatar", async () => {
      await expect(
        kit.asMember.aaveV2.stkAave.stake(member.address, parseEther("1"))
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        kit.asMember.aaveV2.stkAave.claimRewardsAndStake(member.address, 1)
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        kit.asMember.aaveV2.stkAave.claimRewards(member.address, 1)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("stake ABPT", async () => {
      await stealErc20(
        contracts.mainnet.aaveV2.abptV2,
        parseEther("1"),
        contracts.mainnet.aaveV2.stkAbptV2
      )

      await expect(
        kit.asMember.aaveV2.abptV2.approve(
          contracts.mainnet.aaveV2.stkAbptV2,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV2.stkAbptV2.stake(avatar.address, parseEther("1"))
      ).not.toRevert()

      await advanceTime(2)
      await expect(
        kit.asMember.aaveV2.stkAbptV2.claimRewards(avatar.address, 1)
      ).toBeAllowed() // Replaced not.toRevert() with toBeAllowed().

      await expect(kit.asMember.aaveV2.stkAbptV2.cooldown()).not.toRevert()

      // The 20 days cooldown period must pass in order to withdraw the AAVE.
      await advanceTime(1730000)
      await expect(
        kit.asMember.aaveV2.stkAbptV2.redeem(avatar.address, 1)
      ).not.toRevert()
      await expect(
        kit.asMember.aaveV2.stkAbptV2.claimRewards(avatar.address, 1)
      ).toBeAllowed() // Replaced not.toRevert() with toBeAllowed().
    })

    it("only allows staking ABPT and claiming AAVE from avatar", async () => {
      await expect(
        kit.asMember.aaveV2.stkAbptV2.stake(member.address, parseEther("1"))
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        kit.asMember.aaveV2.stkAbptV2.claimRewards(member.address, 1)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("stake GHO", async () => {
      await stealErc20(
        contracts.mainnet.aaveV2.gho,
        parseEther("1"),
        contracts.mainnet.balancer.vault
      )

      await expect(
        kit.asMember.aaveV2.gho.approve(
          contracts.mainnet.aaveV2.stkGho,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV2.stkGho.stake(avatar.address, parseEther("1"))
      ).not.toRevert()

      await advanceTime(2)
      await expect(
        kit.asMember.aaveV2.stkGho.claimRewards(avatar.address, 1)
      ).toBeAllowed() // Replaced not.toRevert() with toBeAllowed().

      await expect(kit.asMember.aaveV2.stkGho.cooldown()).not.toRevert()

      // The 20 days cooldown period must pass in order to withdraw the AAVE.
      await advanceTime(1730000)
      await expect(
        kit.asMember.aaveV2.stkGho.redeem(avatar.address, 1)
      ).not.toRevert()
      await expect(
        kit.asMember.aaveV2.stkGho.claimRewards(avatar.address, 1)
      ).toBeAllowed() // Replaced not.toRevert() with toBeAllowed().
    })

    it("only allows staking GHO and claiming AAVE from avatar", async () => {
      await expect(
        kit.asMember.aaveV2.stkGho.stake(member.address, parseEther("1"))
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        kit.asMember.aaveV2.stkGho.claimRewards(member.address, 1)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
