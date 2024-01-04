import { eth } from "."
import { avatar, member } from "../../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { Status } from "../../../../test/types"
import { testKit } from "../../../../test/kit"
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { parseEther, parseUnits } from "ethers/lib/utils"

describe("compound_v2", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit({ targets: ["ETH", "USDC"] }))
    })

    // Test with ETH
    it("allows depositing ETH on behalf of avatar", async () => {
      await expect(
        testKit.eth.compoundV2.cETH.mint(
          { value: parseEther("1") },
        )
      ).not.toRevert()

      // await expect(
      //   testKit.eth.compoundV2.cETH.mint(
      //     {
      //       value: parseEther("1"),
      //       from: member._address
      //     },
      //   )
      // ).toBeForbidden()
    })

    it("allows withdrawing ETH from avatars' position", async () => {
      await expect(
        testKit.eth.compoundV2.cETH.redeemUnderlying(
          parseEther("0.5")
        )
      ).not.toRevert()

      // await expect(
      //   testKit.eth.compoundV2.cETH.redeemUnderlying(
      //     parseEther("1"),
      //     {
      //       from: member._address
      //     }
      //   )
      // ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("allow setting/removing the deposited ETH as collateral", async () => {
      await expect(
        testKit.eth.compoundV2.comptroller.enterMarkets(
          [contracts.mainnet.compoundV2.cETH]
        )
      ).not.toRevert()
      await expect(
        testKit.eth.compoundV2.comptroller.exitMarket(
          contracts.mainnet.compoundV2.cETH
        )
      ).not.toRevert()
    })

    // Test with USDC
    it("only allows depositing USDC on behalf of avatar", async () => {
      await stealErc20(
        contracts.mainnet.usdc,
        parseUnits("1000", 6),
        contracts.mainnet.balancer.vault
      )
      await expect(
        testKit.eth.usdc.approve(
          // The cToken in the config file corresponds to cUSDC
          contracts.mainnet.compoundV2.cToken,
          parseUnits("1000", 6)
        )
      ).not.toRevert()

      await expect(
        // The cToken in the config file corresponds to cUSDC
        testKit.eth.compoundV2.cToken.mint(
          parseUnits("1000", 6)
        )
      ).not.toRevert()
    })

    it("allows withdrawing USDC from avatars' position", async () => {
      await expect(
        testKit.eth.compoundV2.cToken.redeemUnderlying(
          parseUnits("1000", 6)
        )
      ).not.toRevert()
    })

    it("allow setting/removing the deposited USDC as collateral", async () => {
      await expect(
        testKit.eth.compoundV2.comptroller.enterMarkets(
          [contracts.mainnet.compoundV2.cToken]
        )
      ).not.toRevert()
      await expect(
        testKit.eth.compoundV2.comptroller.exitMarket(
          contracts.mainnet.compoundV2.cToken
        )
      ).not.toRevert()
    })

    it("only allow claiming COMP on behalf of avatar", async () => {
      await expect(
        testKit.eth.compoundV2.comptroller["claimComp(address,address[])"](
          avatar._address,
          [
            contracts.mainnet.compoundV2.cETH,
            // The cToken in the config file corresponds to cUSDC
            contracts.mainnet.compoundV2.cToken
          ]
        )
      ).not.toRevert()
      await expect(
        testKit.eth.compoundV2.comptroller["claimComp(address,address[])"](
          member._address,
          [
            contracts.mainnet.compoundV2.cETH,
            contracts.mainnet.compoundV2.cToken
          ]
        )
      ).toBeForbidden()
    })
  })
})
