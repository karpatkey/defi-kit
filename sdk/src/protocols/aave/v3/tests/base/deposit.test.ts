import { base } from "../../index"
import { wallets } from "../../../../../../test/wallets"
import { applyPermissions } from "../../../../../../test/helpers"
import { contracts } from "../../../../../../eth-sdk/config"
import { Status } from "../../../../../../test/types"
import { base as kit } from "../../../../../../test/kit"
import { parseEther, parseUnits } from "ethers"
import { Chain } from "../../../../../index"

describe("aaveV3", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(
        Chain.base,
        await base.deposit({ targets: ["ETH", "WETH"] })
      )
    })

    // Test with ETH
    it("only allows depositing ETH on behalf of avatar", async () => {
      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.depositETH(
          contracts.base.aaveV3.poolV3,
          wallets.avatar,
          0,
          { value: parseEther("1") }
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.depositETH(
          contracts.base.aaveV3.poolV3,
          wallets.member,
          0,
          { value: parseEther("1") }
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows withdrawing ETH from avatars' position", async () => {
      await expect(
        kit.asMember.aaveV3.aBasWeth.approve(
          contracts.base.aaveV3.wrappedTokenGatewayV3,
          parseEther("1")
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.withdrawETH(
          contracts.base.aaveV3.poolV3,
          parseEther("1"),
          wallets.avatar
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.withdrawETH(
          contracts.base.aaveV3.poolV3,
          parseEther("1"),
          wallets.member
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    // Test with WETH
    it("only allows depositing WETH on behalf of avatar", async () => {
      await expect(
        kit.asMember.weth.approve(contracts.base.aaveV3.poolV3, parseEther("1"))
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.poolV3.supply(
          contracts.base.weth,
          parseEther("1"),
          wallets.avatar,
          0
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.poolV3.supply(
          contracts.base.weth,
          parseEther("1"),
          wallets.member,
          0
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows withdrawing WETH from avatars' position", async () => {
      await expect(
        kit.asMember.aaveV3.poolV3.withdraw(
          contracts.base.weth,
          parseUnits("1", 6),
          wallets.avatar
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.poolV3.withdraw(
          contracts.base.weth,
          parseUnits("1", 6),
          wallets.member
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("allow setting the deposited WETH as collateral", async () => {
      let reserveConfig: Array<any> =
        await kit.asAvatar.aaveV3.protocolDataProviderV3.getReserveConfigurationData(
          contracts.base.weth
        )
      const collateralizable: boolean = reserveConfig[5]
      console.log("is collateralizable: ", collateralizable)
      if (collateralizable) {
        await expect(
          kit.asMember.aaveV3.poolV3.setUserUseReserveAsCollateral(
            contracts.base.weth,
            true
          )
        ).not.toRevert()
      } else {
        await expect(
          kit.asMember.aaveV3.poolV3.setUserUseReserveAsCollateral(
            contracts.base.weth,
            true
          )
        ).toRevert()
      }
    })
  })
})
