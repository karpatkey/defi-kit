import { eth } from "."
import { avatar, member } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { testKit } from "../../../test/kit"
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { parseEther, parseUnits } from "ethers/lib/utils"
import { ethers } from "ethers"

const MAX_AMOUNT =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n

const sdk = getMainnetSdk(avatar)

describe("spark", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(
        await eth.deposit({ targets: ["DSR_sDAI", "ETH", "USDC", "WETH"] })
      )
    })

    // Test with ETH
    it("only allows depositing ETH on behalf of avatar", async () => {
      await expect(
        testKit.eth.spark.wrappedTokenGatewayV3.depositETH(
          contracts.mainnet.spark.sparkLendingPoolV3,
          avatar._address,
          0,
          { value: parseEther("1") }
        )
      ).not.toRevert()

      await expect(
        testKit.eth.spark.wrappedTokenGatewayV3.depositETH(
          contracts.mainnet.spark.sparkLendingPoolV3,
          member._address,
          0,
          { value: parseEther("1") }
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows withdrawing ETH from avatars' position", async () => {
      await expect(
        testKit.eth.spark.spWETH.approve(
          contracts.mainnet.spark.wrappedTokenGatewayV3,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        testKit.eth.spark.wrappedTokenGatewayV3.withdrawETH(
          contracts.mainnet.spark.sparkLendingPoolV3,
          parseEther("1"),
          avatar._address
        )
      ).not.toRevert()

      await expect(
        testKit.eth.spark.wrappedTokenGatewayV3.withdrawETH(
          contracts.mainnet.spark.sparkLendingPoolV3,
          parseEther("1"),
          member._address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("allow setting the deposited ETH as collateral", async () => {
      let reserve_config: Array<any> =
        await sdk.spark.data_provider.getReserveConfigurationData(
          contracts.mainnet.weth
        )
      const collateralizable: boolean = reserve_config[5]
      if (collateralizable) {
        await expect(
          testKit.eth.spark.sparkLendingPoolV3.setUserUseReserveAsCollateral(
            contracts.mainnet.weth,
            true
          )
        ).not.toRevert()
      } else {
        await expect(
          testKit.eth.spark.sparkLendingPoolV3.setUserUseReserveAsCollateral(
            contracts.mainnet.weth,
            true
          )
        ).toRevert()
      }
    })

    // Test with WETH
    it("only allows depositing WETH on behalf of avatar", async () => {
      await stealErc20(
        contracts.mainnet.weth,
        parseEther("1"),
        contracts.mainnet.balancer.vault
      )
      await expect(
        testKit.eth.weth.approve(
          contracts.mainnet.spark.sparkLendingPoolV3,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        testKit.eth.spark.sparkLendingPoolV3.supply(
          contracts.mainnet.weth,
          parseEther("1"),
          avatar._address,
          0
        )
      ).not.toRevert()

      await expect(
        testKit.eth.spark.sparkLendingPoolV3.supply(
          contracts.mainnet.weth,
          parseEther("1"),
          member._address,
          0
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows withdrawing WETH from avatars' position", async () => {
      await expect(
        testKit.eth.spark.sparkLendingPoolV3.withdraw(
          contracts.mainnet.weth,
          parseEther("1"),
          avatar._address
        )
      ).not.toRevert()

      await expect(
        testKit.eth.spark.sparkLendingPoolV3.withdraw(
          contracts.mainnet.weth,
          parseEther("1"),
          member._address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    // Claim rewards to avatar
    it("only claim rewards to avatar", async () => {
      await expect(
        testKit.eth.spark.RewardsController.claimRewards(
          [contracts.mainnet.spark.spWETH],
          MAX_AMOUNT,
          avatar._address,
          contracts.mainnet.lido.wsteth
        )
      ).not.toRevert()

      await expect(
        testKit.eth.spark.RewardsController.claimRewards(
          [contracts.mainnet.spark.spWETH],
          MAX_AMOUNT,
          member._address,
          contracts.mainnet.lido.wsteth
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
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
          contracts.mainnet.spark.sparkLendingPoolV3,
          parseUnits("1000", 6)
        )
      ).not.toRevert()

      await expect(
        testKit.eth.spark.sparkLendingPoolV3.supply(
          contracts.mainnet.usdc,
          parseUnits("1000", 6),
          avatar._address,
          0
        )
      ).not.toRevert()

      await expect(
        testKit.eth.spark.sparkLendingPoolV3.supply(
          contracts.mainnet.usdc,
          parseUnits("1000", 6),
          member._address,
          0
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows withdrawing USDC from avatars' position", async () => {
      await expect(
        testKit.eth.spark.sparkLendingPoolV3.withdraw(
          contracts.mainnet.usdc,
          parseUnits("1000", 6),
          avatar._address
        )
      ).not.toRevert()

      await expect(
        testKit.eth.spark.sparkLendingPoolV3.withdraw(
          contracts.mainnet.usdc,
          parseUnits("1000", 6),
          member._address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("allow setting the deposited USDC as collateral", async () => {
      let reserve_config: Array<any> =
        await sdk.spark.data_provider.getReserveConfigurationData(
          contracts.mainnet.usdc
        )
      const collateralizable: boolean = reserve_config[5]
      if (collateralizable) {
        await expect(
          testKit.eth.spark.sparkLendingPoolV3.setUserUseReserveAsCollateral(
            contracts.mainnet.usdc,
            true
          )
        ).not.toRevert()
      } else {
        await expect(
          testKit.eth.spark.sparkLendingPoolV3.setUserUseReserveAsCollateral(
            contracts.mainnet.usdc,
            true
          )
        ).toRevert()
      }
    })

    it("only allow sDAI deposit and redeem from avatar", async () => {
      await stealErc20(
        contracts.mainnet.dai,
        parseEther("1000"),
        contracts.mainnet.balancer.vault
      )
      await expect(
        testKit.eth.dai.approve(
          contracts.mainnet.spark.sDAI,
          parseEther("1000")
        )
      ).not.toRevert()
      await expect(
        testKit.eth.spark.sDAI.deposit(parseEther("1000"), avatar._address)
      ).not.toRevert()
      const sdai_balance_bn = await sdk.spark.sDAI.balanceOf(avatar._address)
      const sdai_balance = ethers.utils
        .formatUnits(sdai_balance_bn, 18)
        .toString()
      await expect(
        testKit.eth.spark.sDAI.redeem(
          parseEther(sdai_balance),
          avatar._address,
          avatar._address
        )
      ).not.toRevert()

      await expect(
        testKit.eth.spark.sDAI.deposit(parseEther("1000"), member._address)
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        testKit.eth.spark.sDAI.redeem(
          parseEther("1000"),
          member._address,
          member._address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
