import { eth } from "."
import { avatar, member } from "../../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { Status } from "../../../../test/types"
import { testKit } from "../../../../test/kit"
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { parseEther, parseUnits } from "ethers/lib/utils"

describe("aave_v3", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit({ targets: ["ETH", "USDC"] }))
    })

    // Test with ETH
    it("only allows depositing ETH on behalf of avatar", async () => {
      await expect(
        testKit.eth.aaveV3.wrappedTokenGatewayV3.depositETH(
          contracts.mainnet.aaveV3.aaveLendingPoolV3,
          avatar._address,
          0,
          { value: parseEther("1") }
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV3.wrappedTokenGatewayV3.depositETH(
          contracts.mainnet.aaveV3.aaveLendingPoolV3,
          member._address,
          0,
          { value: parseEther("1") }
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows withdrawing ETH from avatars' position", async () => {
      await expect(
        testKit.eth.aaveV3.aEthWETH.approve(
          contracts.mainnet.aaveV3.wrappedTokenGatewayV3,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV3.wrappedTokenGatewayV3.withdrawETH(
          contracts.mainnet.aaveV3.aaveLendingPoolV3,
          parseEther("1"),
          avatar._address
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV3.wrappedTokenGatewayV3.withdrawETH(
          contracts.mainnet.aaveV3.aaveLendingPoolV3,
          parseEther("1"),
          member._address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("allow setting the deposited ETH as collateral", async () => {
      await expect(
        testKit.eth.aaveV3.aaveLendingPoolV3.setUserUseReserveAsCollateral(
          contracts.mainnet.weth,
          true
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
          contracts.mainnet.aaveV3.aaveLendingPoolV3,
          parseUnits("1000", 6)
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV3.aaveLendingPoolV3.supply(
          contracts.mainnet.usdc,
          parseUnits("1000", 6),
          avatar._address,
          0
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV3.aaveLendingPoolV3.supply(
          contracts.mainnet.usdc,
          parseUnits("1000", 6),
          member._address,
          0
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows withdrawing USDC from avatars' position", async () => {
      await expect(
        testKit.eth.aaveV3.aaveLendingPoolV3.withdraw(
          contracts.mainnet.usdc,
          parseUnits("1000", 6),
          avatar._address
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV3.aaveLendingPoolV3.withdraw(
          contracts.mainnet.usdc,
          parseUnits("1000", 6),
          member._address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("allow setting the deposited USDC as collateral", async () => {
      await expect(
        testKit.eth.aaveV3.aaveLendingPoolV3.setUserUseReserveAsCollateral(
          contracts.mainnet.usdc,
          true
        )
      ).not.toRevert()
    })
  })
})
