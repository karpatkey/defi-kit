import { eth } from "."
import { avatar, member } from "../../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { Status } from "../../../../test/types"
import { testKit } from "../../../../test/kit"
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"


describe("aave_v2", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit({ targets: ["ETH", "USDC"] }))
    })

    // Test with ETH
    it("only allows depositing ETH on behalf of avatar", async () => {
      await expect(
        testKit.eth.aaveV2.wrappedTokenGatewayV2.depositETH(
          contracts.mainnet.aaveV2.aaveLendingPoolV2,
          avatar._address,
          0,
          { value: 1000 }
        )
      ).not.toRevert()

      const anotherAddress = member._address
      await expect(
        testKit.eth.aaveV2.wrappedTokenGatewayV2.depositETH(
          contracts.mainnet.aaveV2.aaveLendingPoolV2,
          anotherAddress,
          0,
          { value: 1000 }
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows withdrawing ETH from avatars' position", async () => {
      await expect(
        testKit.eth.aaveV2.aWETH.approve(
          contracts.mainnet.aaveV2.wrappedTokenGatewayV2,
          1000
        )
      ).not.toRevert()

      // If you need to understand the underlying cause of a ModuleTransactionFailed() error, you can do the same call using the SDK directly (without routing it through the Roles mod):
      // await getMainnetSdk(avatar).aaveV2.wrappedTokenGatewayV2.withdrawETH(contracts.mainnet.aaveV2.aaveLendingPoolV2,
      //   1000,
      //   avatar._address)

      await expect(
        testKit.eth.aaveV2.wrappedTokenGatewayV2.withdrawETH(
          contracts.mainnet.aaveV2.aaveLendingPoolV2,
          1000,
          avatar._address
        )
      ).not.toRevert()

      const anotherAddress = member._address
      await expect(
        testKit.eth.aaveV2.wrappedTokenGatewayV2.withdrawETH(
          contracts.mainnet.aaveV2.aaveLendingPoolV2,
          1000,
          anotherAddress
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("allow setting the deposited ETH as collateral", async () => {
      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.setUserUseReserveAsCollateral(
          contracts.mainnet.weth,
          true
        )
      ).not.toRevert()
    })

    // Test with USDC
    it("only allows depositing USDC on behalf of avatar", async () => {
      await stealErc20(contracts.mainnet.usdc, 1000, contracts.mainnet.balancer.vault)

      await expect(
        testKit.eth.usdc.approve(
          contracts.mainnet.aaveV2.aaveLendingPoolV2,
          1000
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.deposit(
          contracts.mainnet.usdc,
          1000,
          avatar._address,
          0
        )
      ).not.toRevert()

      const anotherAddress = member._address
      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.deposit(
          contracts.mainnet.usdc,
          1000,
          anotherAddress,
          0
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows withdrawing USDC from avatars' position", async () => {
      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.withdraw(
          contracts.mainnet.usdc,
          100,
          avatar._address
        )
      ).not.toRevert()

      const anotherAddress = member._address
      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.withdraw(
          contracts.mainnet.usdc,
          1000,
          anotherAddress
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("allow setting the deposited USDC as collateral", async () => {
      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.setUserUseReserveAsCollateral(
          contracts.mainnet.usdc,
          true
        )
      ).not.toRevert()
    })
  })
})
