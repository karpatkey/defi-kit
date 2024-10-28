import { eth } from "."
import { avatar, member } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { testKit } from "../../../test/kit"
import { parseEther } from "ethers"

const steCRV = "0x06325440D014e39736583c165C2963BA99fAf14E"
const cvxsteCRV = "0x9518c9063eB0262D791f38d8d6Eb0aca33c63ed0"
const cvxsteCRV_rewarder = "0x0A760466E1B4621579a82a39CB56Dda2F4E70f03"
const steCRV_holder = "0x4F48031B0EF8acCea3052Af00A3279fbA31b50D8"

describe("convex", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      // Convex ETH/stETH
      await applyPermissions(await eth.deposit({ targets: ["25"] }))
    })
    it("deposit and withdraw curve LP from pool without staking", async () => {
      await stealErc20(steCRV, parseEther("1"), steCRV_holder)
      await expect(
        testKit.eth.usdc
          .attach(steCRV)
          .approve(contracts.mainnet.convex.booster, parseEther("1"))
      ).not.toRevert()

      await expect(
        testKit.eth.convex.booster.deposit(25, parseEther("1"), false)
      ).not.toRevert()
      await expect(
        testKit.eth.convex.booster.deposit(24, parseEther("1"), false)
      ).toBeForbidden(Status.ParameterNotAllowed)

      await expect(
        testKit.eth.convex.booster.withdraw(25, parseEther("1"))
      ).not.toRevert()
      await expect(
        testKit.eth.convex.booster.withdraw(24, parseEther("1"))
      ).toBeForbidden(Status.ParameterNotAllowed)
    }, 60000) // Added 60 seconds of timeout because the deposit takes too long and the test fails.

    it("stake and withdraw cvxDepositToken / withdraw and unwrap cvxDepositToken", async () => {
      await stealErc20(cvxsteCRV, parseEther("2"), cvxsteCRV_rewarder)
      await expect(
        testKit.eth.usdc
          .attach(cvxsteCRV)
          .approve(cvxsteCRV_rewarder, parseEther("2"))
      ).not.toRevert()

      await expect(
        // The rewarder in the config file is the cvxsteCRV_rewarder (no need to attach)
        testKit.eth.convex.rewarder.stake(parseEther("1"))
      ).not.toRevert()
      await expect(
        testKit.eth.convex.rewarder.withdraw(parseEther("1"), false)
      ).not.toRevert()

      await expect(
        testKit.eth.convex.rewarder.stake(parseEther("1"))
      ).not.toRevert()
      await expect(
        testKit.eth.convex.rewarder.withdrawAndUnwrap(parseEther("1"), false)
      ).not.toRevert()
    })

    it("only claim rewards to avatar", async () => {
      await expect(
        testKit.eth.convex.rewarder["getReward(address,bool)"](
          avatar.address,
          true
        )
      ).not.toRevert()
      await expect(
        testKit.eth.convex.rewarder["getReward(address,bool)"](
          member.address,
          true
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
