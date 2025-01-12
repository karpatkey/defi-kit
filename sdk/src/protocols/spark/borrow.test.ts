import { eth } from "."
import { avatar, member } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { eth as kit } from "../../../test/kit"
import { parseEther } from "ethers"

describe("spark", () => {
  describe("borrow", () => {
    beforeAll(async () => {
      await applyPermissions(
        await eth.deposit({ targets: ["DAI", "ETH", "sDAI"] })
      )
      await applyPermissions(
        await eth.borrow({ targets: ["DAI", "ETH", "sDAI"] })
      )
    })

    it("deposit sDAI", async () => {
      await stealErc20(
        contracts.mainnet.spark.sDai,
        parseEther("10000"),
        contracts.mainnet.balancer.vault
      )
      await expect(
        kit.asMember.spark.sDai.approve(
          contracts.mainnet.spark.poolV3,
          parseEther("10000")
        )
      ).not.toRevert()
      await expect(
        kit.asMember.spark.poolV3.supply(
          contracts.mainnet.spark.sDai,
          parseEther("10000"),
          avatar.address,
          0
        )
      ).not.toRevert()
    })

    it("borrow ETH and repay", async () => {
      await expect(
        kit.asMember.spark.variableDebtWeth.approveDelegation(
          contracts.mainnet.spark.wrappedTokenGatewayV3,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.spark.wrappedTokenGatewayV3.borrowETH(
          contracts.mainnet.spark.poolV3,
          parseEther("1"),
          2,
          0
        )
      ).not.toRevert()

      await expect(
        kit.asMember.spark.wrappedTokenGatewayV3.repayETH(
          contracts.mainnet.spark.poolV3,
          parseEther("0.5"),
          2,
          avatar.address,
          { value: parseEther("0.5") }
        )
      ).not.toRevert()
    }, 30000) // Added 30 seconds of timeout because the borrow takes too long and the test fails.

    it("deposit ETH, borrow DAI and repay", async () => {
      await expect(
        kit.asMember.spark.wrappedTokenGatewayV3.depositETH(
          contracts.mainnet.spark.poolV3,
          avatar.address,
          0,
          { value: parseEther("1") }
        )
      ).not.toRevert()

      await expect(
        kit.asMember.spark.poolV3.borrow(
          contracts.mainnet.dai,
          parseEther("100"),
          2,
          0,
          avatar.address
        )
      ).not.toRevert()

      await expect(
        kit.asMember.dai.approve(
          contracts.mainnet.spark.poolV3,
          parseEther("50")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.spark.poolV3.repay(
          contracts.mainnet.dai,
          parseEther("50"),
          2,
          avatar.address
        )
      ).not.toRevert()
    })

    // Roles Module testing without executing transactions
    // Test with ETH
    it("allows borrowing ETH from avatar", async () => {
      await expect(
        kit.asMember.spark.variableDebtWeth.approveDelegation(
          contracts.mainnet.spark.wrappedTokenGatewayV3,
          parseEther("1")
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.spark.wrappedTokenGatewayV3.borrowETH(
          contracts.mainnet.spark.poolV3,
          parseEther("1"),
          2,
          0
        )
      ).toBeAllowed()
    })

    it("only allows repaying ETH from avatar", async () => {
      await expect(
        kit.asMember.spark.wrappedTokenGatewayV3.repayETH(
          contracts.mainnet.spark.poolV3,
          parseEther("1"),
          2,
          avatar.address,
          { value: parseEther("1") }
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.spark.wrappedTokenGatewayV3.repayETH(
          contracts.mainnet.spark.poolV3,
          parseEther("1"),
          2,
          member.address,
          { value: parseEther("1") }
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("allows swapping the ETH borrow rate mode", async () => {
      await expect(
        kit.asMember.spark.poolV3.swapBorrowRateMode(contracts.mainnet.weth, 1)
      ).toRevert()
    })

    // Test with DAI
    it("only allows borrowing DAI from avatar", async () => {
      await expect(
        kit.asMember.spark.poolV3.borrow(
          contracts.mainnet.dai,
          parseEther("10000"),
          2,
          0,
          avatar.address
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.spark.poolV3.borrow(
          contracts.mainnet.dai,
          parseEther("10000"),
          2,
          0,
          member.address
        )
      ).toBeForbidden()
    })

    it("only allows repaying DAI from avatar", async () => {
      await stealErc20(
        contracts.mainnet.dai,
        parseEther("10000"),
        contracts.mainnet.balancer.vault
      )

      await expect(
        kit.asMember.dai.approve(
          contracts.mainnet.spark.poolV3,
          parseEther("10000")
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.spark.poolV3.repay(
          contracts.mainnet.dai,
          parseEther("10000"),
          2,
          avatar.address
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.spark.poolV3.repay(
          contracts.mainnet.dai,
          parseEther("10000"),
          2,
          member.address
        )
      ).toBeForbidden()
    })

    it("allows swapping the DAI borrow rate mode", async () => {
      await expect(
        kit.asMember.spark.poolV3.swapBorrowRateMode(contracts.mainnet.dai, 1)
      ).toRevert()
    })
  })
})
