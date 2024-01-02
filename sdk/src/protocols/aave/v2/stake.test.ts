import { eth } from "."
import { avatar, member } from "../../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { Status } from "../../../../test/types"
import { testKit } from "../../../../test/kit"


describe("aave_v2", () => {
  describe("stake", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.stake({ targets: ["AAVE"] }))
    })

    it("stake AAVE", async () => {
      await stealErc20(
        contracts.mainnet.aaveV2.aave,
        10000000000000,
        contracts.mainnet.balancer.vault,
      )

      await expect(
        testKit.eth.aaveV2.aave.approve(
          contracts.mainnet.aaveV2.stkaave,
          10000000000000,
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV2.stkaave.stake(
          avatar._address,
          10000000000000,
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV2.stkaave.claimRewards(
          avatar._address,
          1,
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV2.stkaave.claimRewardsAndStake(
          avatar._address,
          1,
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV2.stkaave.cooldown()
      ).not.toRevert()

      // await expect(
      //   testKit.eth.aaveV2.stkaave.redeem(
      //     avatar._address,
      //     1,
      //   )
      // ).toBeAllowed()
    })
  })
})