import { eth } from "."
import { avatar, member } from "../../../../test/wallets"
import {
  applyPermissions,
  stealErc20,
  advanceTime,
} from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { Status } from "../../../../test/types"
import { testKit } from "../../../../test/kit"
import { parseEther } from "ethers/lib/utils"

describe("aave_v2", () => {
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
        testKit.eth.aaveV2.aave.approve(
          contracts.mainnet.aaveV2.stkaave,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV2.stkaave.stake(avatar._address, parseEther("1"))
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV2.stkaave.claimRewards(avatar._address, 1)
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV2.stkaave.claimRewardsAndStake(avatar._address, 1)
      ).not.toRevert()

      await expect(testKit.eth.aaveV2.stkaave.cooldown()).not.toRevert()

      // The 20 days cooldown period must pass in order to withdraw the AAVE.
      await advanceTime(1730000)
      await expect(
        testKit.eth.aaveV2.stkaave.redeem(avatar._address, 1)
      ).not.toRevert()
      await expect(
        testKit.eth.aaveV2.stkaave.claimRewardsAndStake(avatar._address, 1)
      ).not.toRevert()
      await expect(
        testKit.eth.aaveV2.stkaave.claimRewards(avatar._address, 1)
      ).not.toRevert()
    })

    it("only allows staking and claiming AAVE from avatar", async () => {
      await expect(
        testKit.eth.aaveV2.stkaave.stake(member._address, parseEther("1"))
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        testKit.eth.aaveV2.stkaave.claimRewardsAndStake(member._address, 1)
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        testKit.eth.aaveV2.stkaave.claimRewards(member._address, 1)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("stake ABPT", async () => {
      await stealErc20(
        contracts.mainnet.aaveV2.abptV2,
        parseEther("1"),
        contracts.mainnet.aaveV2.stkabptV2
      )

      await expect(
        testKit.eth.aaveV2.abptV2.approve(
          contracts.mainnet.aaveV2.stkabptV2,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV2.stkabptV2.stake(avatar._address, parseEther("1"))
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV2.stkabptV2.claimRewards(avatar._address, 1)
      ).not.toRevert()

      await expect(testKit.eth.aaveV2.stkabptV2.cooldown()).not.toRevert()

      // The 20 days cooldown period must pass in order to withdraw the AAVE.
      await advanceTime(1730000)
      await expect(
        testKit.eth.aaveV2.stkabptV2.redeem(avatar._address, 1)
      ).not.toRevert()
      await expect(
        testKit.eth.aaveV2.stkabptV2.claimRewards(avatar._address, 1)
      ).not.toRevert()
    })

    it("only allows staking ABPT and claiming AAVE from avatar", async () => {
      await expect(
        testKit.eth.aaveV2.stkabptV2.stake(member._address, parseEther("1"))
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        testKit.eth.aaveV2.stkabptV2.claimRewards(member._address, 1)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("stake GHO", async () => {
      await stealErc20(
        contracts.mainnet.aaveV2.gho,
        parseEther("1"),
        contracts.mainnet.balancer.vault
      )

      await expect(
        testKit.eth.aaveV2.gho.approve(
          contracts.mainnet.aaveV2.stkgho,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV2.stkgho.stake(avatar._address, parseEther("1"))
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV2.stkgho.claimRewards(avatar._address, 1)
      ).not.toRevert()

      await expect(testKit.eth.aaveV2.stkgho.cooldown()).not.toRevert()

      // The 20 days cooldown period must pass in order to withdraw the AAVE.
      await advanceTime(1730000)
      await expect(
        testKit.eth.aaveV2.stkgho.redeem(avatar._address, 1)
      ).not.toRevert()
      await expect(
        testKit.eth.aaveV2.stkgho.claimRewards(avatar._address, 1)
      ).not.toRevert()
    })

    it("only allows staking GHO and claiming AAVE from avatar", async () => {
      await expect(
        testKit.eth.aaveV2.stkgho.stake(member._address, parseEther("1"))
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        testKit.eth.aaveV2.stkgho.claimRewards(member._address, 1)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
