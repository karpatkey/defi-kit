import { eth } from "."
import { applyPermissions, stealErc20 } from "../../../../test/helpers"
import { eth as kit } from "../../../../test/kit"
import { parseEther } from "ethers"
import { Chain } from "../../.."

const bRethStable = "0x1E19CF2D73a72Ef1332C882F20534B6519Be0276"
const bRethStableGauge = "0x79eF6103A513951a3b25743DB509E267685726B7"

describe("balancer", () => {
  describe("stake", () => {
    beforeAll(async () => {
      await applyPermissions(
        Chain.eth,
        await eth.stake({ targets: ["B-rETH-STABLE"] })
      )
    })

    it("stake and withdraw from gauge", async () => {
      await stealErc20(
        Chain.eth,
        bRethStable,
        parseEther("1"),
        bRethStableGauge
      )
      await expect(
        kit.asMember.usdc
          .attach(bRethStable)
          .approve(bRethStableGauge, parseEther("1"))
      ).not.toRevert()

      await expect(
        kit.asMember.balancerV2.gauge
          .attach(bRethStableGauge)
          ["deposit(uint256)"](parseEther("1"))
      ).not.toRevert()

      await expect(
        kit.asMember.balancerV2.gauge
          .attach(bRethStableGauge)
          ["withdraw(uint256)"](parseEther("1"))
      ).not.toRevert()

      await expect(
        kit.asMember.balancerV2.gauge
          .attach(bRethStableGauge)
          ["claim_rewards()"]()
      ).not.toRevert()

      await expect(
        kit.asMember.balancerV2.minter.mint(bRethStableGauge)
      ).not.toRevert()
    })
  })
})
