import { eth } from "."
import { avatar, member } from "../../../../test/wallets"
import { applyPermissions } from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { Status } from "../../../../test/types"
import { testKit } from "../../../../test/kit"

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

describe("aave_v2", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit({ targets: ["ETH", "USDC"] }))
    })

    // Test with ETH
    it("only allows depositing ETH from avatar", async () => {
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
          WETH,
          true
        )
      ).not.toRevert()
    })

    // Text with USDC
    it("only allows depositing USDC from avatar", async () => {
      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.deposit(
          USDC,
          1000,
          avatar._address,
          0
        )
      ).not.toRevert()

      const anotherAddress = member._address
      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.deposit(
          USDC,
          1000,
          anotherAddress,
          0
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows withdrawing USDC from avatars' position", async () => {
      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.withdraw(
          USDC,
          1000,
          avatar._address
        )
      ).not.toRevert()

      const anotherAddress = member._address
      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.withdraw(
          USDC,
          1000,
          anotherAddress
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("allow setting the deposited USDC as collateral", async () => {
      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.setUserUseReserveAsCollateral(
          USDC,
          true
        )
      ).not.toRevert()
    })
  })
})
