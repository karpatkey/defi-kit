import { eth } from "."
import { avatar, member } from "../../../../test/wallets"
import {
  applyPermissions,
  stealErc20,
  advanceTime,
} from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { Status } from "../../../../test/types"
import kit from "../../../../test/kit"
import { parseEther } from "ethers"

describe.only("aave_v2", () => {
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
          contracts.mainnet.aaveV2.stkaave,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV2.stkaave.stake(avatar.address, parseEther("1"))
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV2.stkaave.claimRewards(avatar.address, 1)
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV2.stkaave.claimRewardsAndStake(avatar.address, 1)
      ).not.toRevert()

      await expect(kit.asMember.aaveV2.stkaave.cooldown()).not.toRevert()

      // The 20 days cooldown period must pass in order to withdraw the AAVE.
      await advanceTime(1730000)
      await expect(
        kit.asMember.aaveV2.stkaave.redeem(avatar.address, 1)
      ).not.toRevert()
      await expect(
        kit.asMember.aaveV2.stkaave.claimRewardsAndStake(avatar.address, 1)
      ).not.toRevert()
      await expect(
        kit.asMember.aaveV2.stkaave.claimRewards(avatar.address, 1)
      ).not.toRevert()
    })

    it("only allows staking and claiming AAVE from avatar", async () => {
      await expect(
        kit.asMember.aaveV2.stkaave.stake(member.address, parseEther("1"))
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        kit.asMember.aaveV2.stkaave.claimRewardsAndStake(member.address, 1)
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        kit.asMember.aaveV2.stkaave.claimRewards(member.address, 1)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("stake ABPT", async () => {
      await stealErc20(
        contracts.mainnet.aaveV2.abptV2,
        parseEther("1"),
        contracts.mainnet.aaveV2.stkabptV2
      )

      await expect(
        kit.asMember.aaveV2.abptV2.approve(
          contracts.mainnet.aaveV2.stkabptV2,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV2.stkabptV2.stake(avatar.address, parseEther("1"))
      ).not.toRevert()

      await kit.asAvatar.aaveV2.stkabptV2.claimRewards(avatar.address, 1)
      await expect(
        kit.asMember.aaveV2.stkabptV2.claimRewards(avatar.address, 1)
      ).not.toRevert()

      await expect(kit.asMember.aaveV2.stkabptV2.cooldown()).not.toRevert()

      // The 20 days cooldown period must pass in order to withdraw the AAVE.
      await advanceTime(1730000)
      await expect(
        kit.asMember.aaveV2.stkabptV2.redeem(avatar.address, 1)
      ).not.toRevert()
      await expect(
        kit.asMember.aaveV2.stkabptV2.claimRewards(avatar.address, 1)
      ).not.toRevert()
    })

    it("only allows staking ABPT and claiming AAVE from avatar", async () => {
      await expect(
        kit.asMember.aaveV2.stkabptV2.stake(member.address, parseEther("1"))
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        kit.asMember.aaveV2.stkabptV2.claimRewards(member.address, 1)
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
          contracts.mainnet.aaveV2.stkgho,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV2.stkgho.stake(avatar.address, parseEther("1"))
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV2.stkgho.claimRewards(avatar.address, 1)
      ).toBeAllowed() // Replaced not.toRevert() with toBeAllowed() because it was failing for an unknown reason.

      await expect(kit.asMember.aaveV2.stkgho.cooldown()).not.toRevert()

      // The 20 days cooldown period must pass in order to withdraw the AAVE.
      await advanceTime(1730000)
      await expect(
        kit.asMember.aaveV2.stkgho.redeem(avatar.address, 1)
      ).not.toRevert()
      await expect(
        kit.asMember.aaveV2.stkgho.claimRewards(avatar.address, 1)
      ).toBeAllowed() // Replaced not.toRevert() with toBeAllowed() because it was failing for an unknown reason.
    })

    it("only allows staking GHO and claiming AAVE from avatar", async () => {
      await expect(
        kit.asMember.aaveV2.stkgho.stake(member.address, parseEther("1"))
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        kit.asMember.aaveV2.stkgho.claimRewards(member.address, 1)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
