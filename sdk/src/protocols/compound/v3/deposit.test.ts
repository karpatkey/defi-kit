import { eth } from "."
import { applyPermissions, stealErc20 } from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { eth as kit } from "../../../../test/kit"
import { parseUnits } from "ethers"
import { Chain } from "../../../../src"

describe("compoundV3", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(
        Chain.eth,
        await eth.deposit({ targets: ["cUSDCv3"] })
      )
    })

    it("allows depositing USDC on behalf of avatar", async () => {
      await stealErc20(
        Chain.eth,
        contracts.mainnet.usdc,
        parseUnits("10000", 6),
        contracts.mainnet.balancerV2.vault
      )
      await expect(
        kit.asMember.usdc.approve(
          contracts.mainnet.compoundV3.cUsdcV3,
          parseUnits("10000", 6)
        )
      ).not.toRevert()
      await expect(
        kit.asMember.compoundV3.cUsdcV3.supply(
          contracts.mainnet.usdc,
          parseUnits("10000", 6)
        )
      ).not.toRevert()
      await expect(
        kit.asMember.compoundV3.cUsdcV3.withdraw(
          contracts.mainnet.usdc,
          parseUnits("10000", 6)
        )
      ).not.toRevert()
    })
  })
})
