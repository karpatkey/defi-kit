import { eth } from "."
import { avatar, member } from "../../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { Status } from "../../../../test/types"
import { testKit } from "../../../../test/kit"
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { parseEther, parseUnits } from "ethers/lib/utils"

describe("compound_v3", () => {
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
        testKit.eth.usdc.approve(
          contracts.mainnet.compoundV3.cUSDCv3,
          parseUnits("10000", 6)
        )
      ).not.toRevert()
      await expect(
        testKit.eth.compoundV3.cUSDCv3.supply(
          contracts.mainnet.usdc,
          parseUnits("10000", 6)
        )
      ).not.toRevert()
    })
  })
})