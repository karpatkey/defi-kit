import { oeth } from "../../index"
import { wallets } from "../../../../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../../../../test/helpers"
import { contracts } from "../../../../../../eth-sdk/config"
import { Status } from "../../../../../../test/types"
import { oeth as kit } from "../../../../../../test/kit"
import { parseEther, parseUnits } from "ethers"
import { Chain } from "../../../../../index"

describe("aaveV3", () => {
  describe("borrow", () => {
    beforeAll(async () => {
      await applyPermissions(
        Chain.oeth,
        await oeth.deposit({ targets: ["ETH", "USDC"] })
      )
      await applyPermissions(
        Chain.oeth,
        await oeth.borrow({ targets: ["ETH", "USDC"] })
      )
    })

    it("deposit USDC", async () => {
      await stealErc20(
        Chain.oeth,
        contracts.optimism.usdc,
        parseUnits("10000", 6),
        contracts.optimism.balancer.vault
      )
      await expect(
        kit.asMember.usdc.approve(
          contracts.optimism.aaveV3.poolV3,
          parseUnits("10000", 6)
        )
      ).not.toRevert()
      await expect(
        kit.asMember.aaveV3.poolV3.supply(
          contracts.optimism.usdc,
          parseUnits("10000", 6),
          wallets.avatar,
          0
        )
      ).not.toRevert()
    })

    it("borrow ETH and repay", async () => {
      await expect(
        kit.asMember.aaveV3.variableDebtWeth.approveDelegation(
          contracts.optimism.aaveV3.wrappedTokenGatewayV3,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.borrowETH(
          contracts.optimism.aaveV3.poolV3,
          parseEther("1"),
          0
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.repayETH(
          contracts.optimism.aaveV3.poolV3,
          parseEther("0.5"),
          wallets.avatar,
          { value: parseEther("0.5") }
        )
      ).not.toRevert()
    })

    it("deposit ETH, borrow USDC and repay", async () => {
      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.depositETH(
          contracts.optimism.aaveV3.poolV3,
          wallets.avatar,
          0,
          { value: parseEther("1") }
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.poolV3.borrow(
          contracts.optimism.usdc,
          parseUnits("100", 6),
          2,
          0,
          wallets.avatar
        )
      ).not.toRevert()

      await expect(
        kit.asMember.usdc.approve(
          contracts.optimism.aaveV3.poolV3,
          parseUnits("50", 6)
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.poolV3.repay(
          contracts.optimism.usdc,
          parseUnits("50", 6),
          2,
          wallets.avatar
        )
      ).not.toRevert()
    })

    // Roles Module testing without executing transactions
    // Test with ETH
    it("allows borrowing ETH from avatar", async () => {
      await expect(
        kit.asMember.aaveV3.variableDebtWeth.approveDelegation(
          contracts.optimism.aaveV3.wrappedTokenGatewayV3,
          parseEther("1")
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.borrowETH(
          contracts.optimism.aaveV3.poolV3,
          parseEther("1"),
          0
        )
      ).toBeAllowed()
    })

    it("only allows repaying ETH from avatar", async () => {
      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.repayETH(
          contracts.optimism.aaveV3.poolV3,
          parseEther("1"),
          wallets.avatar,
          { value: parseEther("1") }
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.repayETH(
          contracts.optimism.aaveV3.poolV3,
          parseEther("1"),
          wallets.member,
          { value: parseEther("1") }
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    // Test with USDC
    it("only allows borrowing USDC from avatar", async () => {
      await expect(
        kit.asMember.aaveV3.poolV3.borrow(
          contracts.optimism.usdc,
          parseUnits("10000", 6),
          2,
          0,
          wallets.avatar
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.poolV3.borrow(
          contracts.optimism.usdc,
          parseUnits("10000", 6),
          2,
          0,
          wallets.member
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows repaying USDC from avatar", async () => {
      await stealErc20(
        Chain.eth,
        contracts.optimism.usdc,
        parseUnits("10000", 6),
        contracts.optimism.balancer.vault
      )

      await expect(
        kit.asMember.usdc.approve(
          contracts.optimism.aaveV3.poolV3,
          parseUnits("10000", 6)
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.poolV3.repay(
          contracts.optimism.usdc,
          parseUnits("10000", 6),
          2,
          wallets.avatar
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.poolV3.repay(
          contracts.optimism.usdc,
          parseUnits("10000", 6),
          2,
          wallets.member
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
