import { eth } from "."
import { avatar, member } from "../../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { Status } from "../../../../test/types"
import { testKit } from "../../../../test/kit"
import { parseEther, parseUnits } from "ethers/lib/utils"

describe("aave_v2", () => {
  describe("borrow", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit({ targets: ["ETH", "USDC"] }))
      await applyPermissions(await eth.borrow({ targets: ["ETH", "USDC"] }))
    })

    it("deposit USDC", async () => {
      await stealErc20(
        contracts.mainnet.usdc,
        parseUnits("10000", 6),
        contracts.mainnet.balancer.vault
      )
      await expect(
        testKit.eth.usdc.approve(
          contracts.mainnet.aaveV2.aaveLendingPoolV2,
          parseUnits("10000", 6)
        )
      ).not.toRevert()
      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.deposit(
          contracts.mainnet.usdc,
          parseUnits("10000", 6),
          avatar._address,
          0
        )
      ).not.toRevert()
    }, 30000) // Added 30 seconds of timeout because the deposit takes too long and the test fails.

    it("borrow ETH and repay", async () => {
      await expect(
        testKit.eth.aaveV2.variableDebtWETH.approveDelegation(
          contracts.mainnet.aaveV2.wrappedTokenGatewayV2,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV2.wrappedTokenGatewayV2.borrowETH(
          contracts.mainnet.aaveV2.aaveLendingPoolV2,
          parseEther("1"),
          2,
          0
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV2.wrappedTokenGatewayV2.repayETH(
          contracts.mainnet.aaveV2.aaveLendingPoolV2,
          parseEther("0.5"),
          2,
          avatar._address,
          { value: parseEther("0.5") }
        )
      ).not.toRevert()
    }, 30000) // Added 30 seconds of timeout because the borrowETH takes too long and the test fails.

    it("deposit ETH, borrow USDC and repay", async () => {
      await expect(
        testKit.eth.aaveV2.wrappedTokenGatewayV2.depositETH(
          contracts.mainnet.aaveV2.aaveLendingPoolV2,
          avatar._address,
          0,
          { value: parseEther("1") }
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.borrow(
          contracts.mainnet.usdc,
          parseUnits("100", 6),
          2,
          0,
          avatar._address
        )
      ).not.toRevert()

      await expect(
        testKit.eth.usdc.approve(
          contracts.mainnet.aaveV2.aaveLendingPoolV2,
          parseUnits("50", 6)
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.repay(
          contracts.mainnet.usdc,
          parseUnits("50", 6),
          2,
          avatar._address
        )
      ).not.toRevert()
    })

    // Roles Module testing without executing transactions
    // Test with ETH
    it("allows borrowing ETH from avatar", async () => {
      await expect(
        testKit.eth.aaveV2.variableDebtWETH.approveDelegation(
          contracts.mainnet.aaveV2.wrappedTokenGatewayV2,
          parseEther("1")
        )
      ).toBeAllowed()

      await expect(
        testKit.eth.aaveV2.wrappedTokenGatewayV2.borrowETH(
          contracts.mainnet.aaveV2.aaveLendingPoolV2,
          parseEther("1"),
          2,
          0
        )
      ).toBeAllowed()
    })

    it("only allows repaying ETH from avatar", async () => {
      await expect(
        testKit.eth.aaveV2.wrappedTokenGatewayV2.repayETH(
          contracts.mainnet.aaveV2.aaveLendingPoolV2,
          parseEther("1"),
          2,
          avatar._address,
          { value: parseEther("1") }
        )
      ).toBeAllowed()

      await expect(
        testKit.eth.aaveV2.wrappedTokenGatewayV2.repayETH(
          contracts.mainnet.aaveV2.aaveLendingPoolV2,
          parseEther("1"),
          2,
          member._address,
          { value: parseEther("1") }
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("allows swapping the ETH borrow rate mode", async () => {
      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.swapBorrowRateMode(
          contracts.mainnet.weth,
          1
        )
      ).toRevert()
    })

    // Test with USDC
    it("only allows borrowing USDC from avatar", async () => {
      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.borrow(
          contracts.mainnet.usdc,
          parseUnits("10000", 6),
          2,
          0,
          avatar._address
        )
      ).toBeAllowed()

      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.borrow(
          contracts.mainnet.usdc,
          parseUnits("10000", 6),
          2,
          0,
          member._address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows repaying USDC from avatar", async () => {
      await stealErc20(
        contracts.mainnet.usdc,
        parseUnits("10000", 6),
        contracts.mainnet.balancer.vault
      )

      await expect(
        testKit.eth.usdc.approve(
          contracts.mainnet.aaveV2.aaveLendingPoolV2,
          parseUnits("10000", 6)
        )
      ).toBeAllowed()

      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.repay(
          contracts.mainnet.usdc,
          parseUnits("10000", 6),
          2,
          avatar._address
        )
      ).toBeAllowed()

      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.repay(
          contracts.mainnet.usdc,
          parseUnits("10000", 6),
          2,
          member._address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("allows swapping the USDC borrow rate mode", async () => {
      await expect(
        testKit.eth.aaveV2.aaveLendingPoolV2.swapBorrowRateMode(
          contracts.mainnet.usdc,
          1
        )
      ).toRevert()
    })
  })
})
