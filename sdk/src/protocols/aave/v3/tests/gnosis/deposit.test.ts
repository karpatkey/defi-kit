import { gno } from "../../index"
import { wallets } from "../../../../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../../../../test/helpers"
import { contracts } from "../../../../../../eth-sdk/config"
import { Status } from "../../../../../../test/types"
import { parseEther, parseUnits } from "ethers"
import { Chain } from "../../../../../index"
import { gno as kit } from "../../../../../../test/kit"

describe("aaveV3", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(
        Chain.gno,
        await gno.deposit({ targets: ["XDAI", "USDC", "WETH"] })
      )
    })

    it("only allows depositing XDAI on behalf of avatar", async () => {
      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.depositETH(
          contracts.gnosis.aaveV3.poolV3,
          wallets.avatar,
          0,
          { value: parseEther("1") }
        )
      ).not.toRevert()
      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.depositETH(
          contracts.gnosis.aaveV3.poolV3,
          wallets.member,
          0,
          { value: parseEther("1") }
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows withdrawing XDAI from avatars' position", async () => {
      await expect(
        kit.asMember.aaveV3.aGnoWXDAI.approve(
          contracts.gnosis.aaveV3.wrappedTokenGatewayV3,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.withdrawETH(
          contracts.gnosis.aaveV3.poolV3,
          parseEther("1"),
          wallets.avatar
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.withdrawETH(
          contracts.gnosis.aaveV3.poolV3,
          parseEther("1"),
          wallets.member
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("allow setting the deposited GNO as collateral", async () => {
      let reserveConfig: Array<any> =
        await kit.asAvatar.aaveV3.poolV3.getReserveData(contracts.gnosis.gno)
      const collateralizable: boolean = reserveConfig[5]
      console.log("is collateralizable: ", collateralizable)
      if (collateralizable) {
        await expect(
          kit.asMember.aaveV3.poolV3.setUserUseReserveAsCollateral(
            contracts.gnosis.gno,
            true
          )
        ).not.toRevert()
      } else {
        await expect(
          kit.asMember.aaveV3.poolV3.setUserUseReserveAsCollateral(
            contracts.gnosis.gno,
            true
          )
        ).toRevert()
      }
    })
    //TEST WITH USDC
    it("only allows depositing USDC on behalf of avatar", async () => {
      await stealErc20(
        Chain.gno,
        contracts.gnosis.usdc,
        parseUnits("1000", 6),
        contracts.gnosis.balancer.vault
      )
      await expect(
        kit.asMember.usdc.approve(
          contracts.gnosis.aaveV3.poolV3,
          parseUnits("1000", 6)
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.poolV3.supply(
          contracts.gnosis.usdc,
          parseUnits("1000", 6),
          wallets.avatar,
          0
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.poolV3.supply(
          contracts.gnosis.usdc,
          parseUnits("1000", 6),
          wallets.member,
          0
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows withdrawing USDC from avatars' position", async () => {
      await expect(
        kit.asMember.aaveV3.poolV3.withdraw(
          contracts.gnosis.usdc,
          parseUnits("1000", 6),
          wallets.avatar
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.poolV3.withdraw(
          contracts.gnosis.usdc,
          parseUnits("1000", 6),
          wallets.member
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("allow setting the deposited USDC as collateral", async () => {
      let reserveConfig: Array<any> =
        await kit.asAvatar.aaveV3.protocolDataProviderV3.getReserveConfigurationData(
          contracts.gnosis.usdc
        )
      const collateralizable: boolean = reserveConfig[5]
      console.log("is collateralizable: ", collateralizable)
      if (collateralizable) {
        await expect(
          kit.asMember.aaveV3.poolV3.setUserUseReserveAsCollateral(
            contracts.gnosis.usdc,
            true
          )
        ).not.toRevert()
      } else {
        await expect(
          kit.asMember.aaveV3.poolV3.setUserUseReserveAsCollateral(
            contracts.gnosis.usdc,
            true
          )
        ).toRevert()
      }
    })
  })
})
