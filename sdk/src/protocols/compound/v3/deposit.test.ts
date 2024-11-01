import { eth } from "."
import { applyPermissions, stealErc20 } from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { eth as kit } from "../../../../test/kit"
import { parseUnits } from "ethers"

// TODO we need to find a solution for handling the compundV3 bulker permissions
describe.skip("compound_v3", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      console.log("before apply")
      await applyPermissions(await eth.deposit({ targets: ["cUSDCv3"] }))
      console.log("after apply")
    })

    // Deposit USDC
    it("allows depositing USDC on behalf of avatar", async () => {
      await stealErc20(
        contracts.mainnet.usdc,
        parseUnits("10000", 6),
        contracts.mainnet.balancer.vault
      )
      await expect(
        kit.asMember.usdc.approve(
          contracts.mainnet.compoundV3.cUSDCv3,
          parseUnits("10000", 6)
        )
      ).not.toRevert()
      await expect(
        kit.asMember.compoundV3.cUSDCv3.supply(
          contracts.mainnet.usdc,
          parseUnits("10000", 6)
        )
      ).not.toRevert()
    })
  })
})
