import { eth } from "."
import { avatar, member } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { eth as kit } from "../../../test/kit"
import { formatUnits, parseEther, parseUnits } from "ethers"

const MAX_AMOUNT =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n

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
        kit.asMember.spark.wrappedTokenGatewayV3.depositETH(
          contracts.mainnet.spark.lendingPoolV3,
          avatar.address,
          0,
          { value: parseEther("1") }
        )
      ).not.toRevert()

      await expect(
        kit.asMember.spark.wrappedTokenGatewayV3.depositETH(
          contracts.mainnet.spark.lendingPoolV3,
          member.address,
          0,
          { value: parseEther("1") }
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows withdrawing ETH from avatars' position", async () => {
      await expect(
        kit.asMember.spark.spWeth.approve(
          contracts.mainnet.spark.wrappedTokenGatewayV3,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.spark.wrappedTokenGatewayV3.withdrawETH(
          contracts.mainnet.spark.lendingPoolV3,
          parseEther("1"),
          avatar.address
        )
      ).not.toRevert()

      await expect(
        kit.asMember.spark.wrappedTokenGatewayV3.withdrawETH(
          contracts.mainnet.spark.lendingPoolV3,
          parseEther("1"),
          member.address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("allow setting the deposited ETH as collateral", async () => {
      let reserve_config: Array<any> =
        await kit.asAvatar.spark.dataProvider.getReserveConfigurationData(
          contracts.mainnet.weth
        )
      const collateralizable: boolean = reserve_config[5]
      if (collateralizable) {
        await expect(
          kit.asMember.spark.lendingPoolV3.setUserUseReserveAsCollateral(
            contracts.mainnet.weth,
            true
          )
        ).not.toRevert()
      } else {
        await expect(
          kit.asMember.spark.lendingPoolV3.setUserUseReserveAsCollateral(
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
        kit.asMember.weth.approve(
          contracts.mainnet.spark.lendingPoolV3,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.spark.lendingPoolV3.supply(
          contracts.mainnet.weth,
          parseEther("1"),
          avatar.address,
          0
        )
      ).not.toRevert()

      await expect(
        kit.asMember.spark.lendingPoolV3.supply(
          contracts.mainnet.weth,
          parseEther("1"),
          member.address,
          0
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows withdrawing WETH from avatars' position", async () => {
      await expect(
        kit.asMember.spark.lendingPoolV3.withdraw(
          contracts.mainnet.weth,
          parseEther("1"),
          avatar.address
        )
      ).not.toRevert()

      await expect(
        kit.asMember.spark.lendingPoolV3.withdraw(
          contracts.mainnet.weth,
          parseEther("1"),
          member.address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    // Claim rewards to avatar
    it("only claim rewards to avatar", async () => {
      await expect(
        kit.asMember.spark.rewardsController.claimRewards(
          [contracts.mainnet.spark.spWeth],
          MAX_AMOUNT,
          avatar.address,
          contracts.mainnet.lido.wstEth
        )
      ).not.toRevert()

      await expect(
        kit.asMember.spark.rewardsController.claimRewards(
          [contracts.mainnet.spark.spWeth],
          MAX_AMOUNT,
          member.address,
          contracts.mainnet.lido.wstEth
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
        kit.asMember.usdc.approve(
          contracts.mainnet.spark.lendingPoolV3,
          parseUnits("1000", 6)
        )
      ).not.toRevert()

      await expect(
        kit.asMember.spark.lendingPoolV3.supply(
          contracts.mainnet.usdc,
          parseUnits("1000", 6),
          avatar.address,
          0
        )
      ).not.toRevert()

      await expect(
        kit.asMember.spark.lendingPoolV3.supply(
          contracts.mainnet.usdc,
          parseUnits("1000", 6),
          member.address,
          0
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows withdrawing USDC from avatars' position", async () => {
      await expect(
        kit.asMember.spark.lendingPoolV3.withdraw(
          contracts.mainnet.usdc,
          parseUnits("1000", 6),
          avatar.address
        )
      ).not.toRevert()

      await expect(
        kit.asMember.spark.lendingPoolV3.withdraw(
          contracts.mainnet.usdc,
          parseUnits("1000", 6),
          member.address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("allow setting the deposited USDC as collateral", async () => {
      let reserve_config: Array<any> =
        await kit.asAvatar.spark.dataProvider.getReserveConfigurationData(
          contracts.mainnet.usdc
        )
      const collateralizable: boolean = reserve_config[5]
      if (collateralizable) {
        await expect(
          kit.asMember.spark.lendingPoolV3.setUserUseReserveAsCollateral(
            contracts.mainnet.usdc,
            true
          )
        ).not.toRevert()
      } else {
        await expect(
          kit.asMember.spark.lendingPoolV3.setUserUseReserveAsCollateral(
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
        kit.asMember.dai.approve(
          contracts.mainnet.spark.sDai,
          parseEther("1000")
        )
      ).not.toRevert()
      await expect(
        kit.asMember.spark.sDai.deposit(parseEther("1000"), avatar.address)
      ).not.toRevert()
      const sdai_balance_bn = await kit.asAvatar.spark.sDai.balanceOf(
        avatar.address
      )
      const sdai_balance = formatUnits(sdai_balance_bn, 18).toString()
      await expect(
        kit.asMember.spark.sDai.redeem(
          parseEther(sdai_balance),
          avatar.address,
          avatar.address
        )
      ).not.toRevert()

      await expect(
        kit.asMember.spark.sDai.deposit(parseEther("1000"), member.address)
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        kit.asMember.spark.sDai.redeem(
          parseEther("1000"),
          member.address,
          member.address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
