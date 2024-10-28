import { eth } from "."
import { avatar, member } from "../../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { Status } from "../../../../test/types"
import { testKit } from "../../../../test/kit"
import { parseEther, parseUnits } from "ethers/lib/utils"

describe("compound_v2", () => {
  describe("borrow", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit({ targets: ["ETH", "USDC"] }))
      await applyPermissions(await eth.borrow({ tokens: ["ETH", "USDC"] }))
    })

    it("deposit USDC", async () => {
      await stealErc20(
        contracts.mainnet.usdc,
        parseUnits("10000", 6),
        contracts.mainnet.balancer.vault
      )
      await expect(
        testKit.eth.usdc.approve(
          // The cToken in the config file corresponds to cUSDC
          contracts.mainnet.compoundV2.cToken,
          parseUnits("10000", 6)
        )
      ).not.toRevert()

      await expect(
        // The cToken in the config file corresponds to cUSDC
        testKit.eth.compoundV2.cToken.mint(parseUnits("10000", 6))
      ).not.toRevert()
    })

    it("borrow ETH and only repay from avatar", async () => {
      await expect(
        testKit.eth.compoundV2.cETH.borrow(parseEther("1"))
      ).not.toRevert()

      await expect(
        testKit.eth.compoundV2.maximillion.repayBehalf(avatar.address, {
          value: parseEther("0.5"),
        })
      ).not.toRevert()

      await expect(
        testKit.eth.compoundV2.maximillion.repayBehalf(member.address, {
          value: parseEther("0.5"),
        })
      ).toBeForbidden()
    })

    it("deposit ETH, borrow USDC and repay", async () => {
      await expect(
        testKit.eth.compoundV2.cETH.mint({ value: parseEther("1") })
      ).not.toRevert()

      await expect(
        // The cToken in the config file corresponds to cUSDC
        testKit.eth.compoundV2.cToken.borrow(parseUnits("100", 6))
      ).not.toRevert()

      await expect(
        testKit.eth.usdc.approve(
          // The cToken in the config file corresponds to cUSDC
          contracts.mainnet.compoundV2.cToken,
          parseUnits("50", 6)
        )
      ).not.toRevert()

      await expect(
        // The cToken in the config file corresponds to cUSDC
        testKit.eth.compoundV2.cToken.repayBorrow(parseUnits("50", 6))
      ).not.toRevert()
    })
  })
})
