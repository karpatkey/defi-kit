import { eth } from "."
import { CRV, CVX, ZERO_ADDRESS } from "./actions"
import { avatar, member } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { testKit } from "../../../test/kit"
import { parseEther } from "ethers/lib/utils"

const cvxCRV = "0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7"

describe("convex", () => {
  describe("stake", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.stake({ targets: ["CVX", "cvxCRV"] }))
    })
    it("convert CRV to cvxCRV", async () => {
      await stealErc20(CRV, parseEther("2"), contracts.mainnet.balancer.vault)
      await expect(
        testKit.eth.usdc
          .attach(CRV)
          .approve(contracts.mainnet.convex.CrvDepositor, parseEther("2"))
      ).not.toRevert()

      // Converts CRV to cvxCRV
      await expect(
        testKit.eth.convex.CrvDepositor["deposit(uint256,bool)"](
          parseEther("1"),
          false
        )
      ).not.toRevert()

      await expect(
        testKit.eth.convex.CrvDepositor["deposit(uint256,bool,address)"](
          parseEther("1"),
          false,
          ZERO_ADDRESS
        )
      ).not.toRevert()
    })

    it("stake and withdraw cvxCRV / set rewards weight and claim", async () => {
      await expect(
        testKit.eth.usdc
          .attach(cvxCRV)
          .approve(contracts.mainnet.convex.stkCvxCrv, parseEther("1"))
      ).not.toRevert()
      // Using cvxCRV
      await expect(
        testKit.eth.convex.stkCvxCrv.stake(parseEther("1"), avatar._address)
      ).not.toRevert()

      await stealErc20(CRV, parseEther("1"), contracts.mainnet.balancer.vault)
      await expect(
        testKit.eth.usdc
          .attach(CRV)
          .approve(contracts.mainnet.convex.CrvDepositor, parseEther("1"))
      ).not.toRevert()
      // Using CRV
      await expect(
        testKit.eth.convex.CrvDepositor["deposit(uint256,bool,address)"](
          parseEther("1"),
          true,
          contracts.mainnet.convex.stkCvxCrv
        )
      ).not.toRevert()

      // Rewards
      await expect(
        testKit.eth.convex.stkCvxCrv.setRewardWeight(5000)
      ).not.toRevert()
      await expect(
        testKit.eth.convex.stkCvxCrv["getReward(address)"](avatar._address)
      ).not.toRevert()
      await expect(
        testKit.eth.convex.stkCvxCrv["getReward(address)"](member._address)
      ).toBeForbidden(Status.ParameterNotAllowed)

      // Withdraw
      await expect(
        testKit.eth.convex.stkCvxCrv.withdraw(parseEther("1"))
      ).not.toRevert()
    }, 60000) // Added 60 seconds of timeout because the deposit takes too long and the test fails.

    it("stake and withdraw CVX / claim rewards", async () => {
      await stealErc20(CVX, parseEther("1"), contracts.mainnet.balancer.vault)
      await expect(
        testKit.eth.usdc
          .attach(CVX)
          .approve(contracts.mainnet.convex.cvxRewardPool, parseEther("1"))
      ).not.toRevert()

      await expect(
        testKit.eth.convex.cvxRewardPool.stake(parseEther("1"))
      ).not.toRevert()

      await expect(
        testKit.eth.convex.cvxRewardPool["getReward(bool)"](false)
      ).not.toRevert()

      await expect(
        testKit.eth.convex.cvxRewardPool.withdraw(parseEther("1"), true)
      ).not.toRevert()
    })
  })
})
