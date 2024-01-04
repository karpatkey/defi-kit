import { eth } from "."
import { avatar, member } from "../../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { Status } from "../../../../test/types"
import { testKit } from "../../../../test/kit"
import { parseEther } from "ethers/lib/utils"

describe("aave_v2", () => {
  describe("stake", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.stake({ targets: ["AAVE"] }))
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

      // The redeem() is only tested to go through the roles because
      // the cooldown period should pass in order to withdraw the AAVE.
      await expect(
        testKit.eth.aaveV2.stkaave.redeem(avatar._address, 1)
      ).toBeAllowed()
    })

    it("only allows staking AAVE from avatar", async () => {
      const anotherAddress = member._address

      await expect(
        testKit.eth.aaveV2.stkaave.stake(anotherAddress, parseEther("1"))
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
