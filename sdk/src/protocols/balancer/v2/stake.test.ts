import { eth } from "."
import { applyPermissions, stealErc20 } from "../../../../test/helpers"
import { eth as kit } from "../../../../test/kit"
import { parseEther } from "ethers"
import { Chain } from "../../.."

const bAuraBalStable = "0x3dd0843A028C86e0b760b1A76929d1C5Ef93a2dd"
const bAuraBalStableGauge = "0x0312AA8D0BA4a1969Fddb382235870bF55f7f242"

describe("balancer", () => {
  describe("stake", () => {
    beforeAll(async () => {
      await applyPermissions(
        Chain.eth,
        await eth.stake({ targets: ["B-auraBAL-STABLE"] })
      )
    })

    it("stake and withdraw from gauge", async () => {
      await stealErc20(
        Chain.eth,
        bAuraBalStable,
        parseEther("1"),
        bAuraBalStableGauge
      )
      await expect(
        kit.asMember.usdc
          .attach(bAuraBalStable)
          .approve(bAuraBalStableGauge, parseEther("1"))
      ).not.toRevert()

      await expect(
        kit.asMember.balancerV2.gauge
          .attach(bAuraBalStableGauge)
          ["deposit(uint256)"](parseEther("1"))
      ).not.toRevert()

      await expect(
        kit.asMember.balancerV2.gauge
          .attach(bAuraBalStableGauge)
          ["withdraw(uint256)"](parseEther("1"))
      ).not.toRevert()

      await expect(
        kit.asMember.balancerV2.gauge
          .attach(bAuraBalStableGauge)
          ["claim_rewards()"]()
      ).not.toRevert()

      await expect(
        kit.asMember.balancerV2.minter.mint(bAuraBalStableGauge)
      ).not.toRevert()
    })
  })
})
