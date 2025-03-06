import { gno } from "../../index"
import { wallets } from "../../../../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../../../../test/helpers"
import { contracts } from "../../../../../../eth-sdk/config"
import { Status } from "../../../../../../test/types"
import { gno as kit } from "../../../../../../test/kit"
import { parseEther, parseUnits } from "ethers"
import { Chain } from "../../../../../index"

describe("aaveV3", () => {
  describe("borrow", () => {
    beforeAll(async () => {
      await applyPermissions(
        Chain.gno,
        await gno.deposit({ targets: ["XDAI", "USDC"] })
      )
      await applyPermissions(
        Chain.gno,
        await gno.borrow({ targets: ["XDAI", "USDC"] })
      )
    })

    it("deposit USDC", async () => {
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
    })

    it("borrow XDAI and repay", async () => {
      await expect(
        kit.asMember.aaveV3.variableDebtWXDAI.approveDelegation(
          contracts.gnosis.aaveV3.wrappedTokenGatewayV3,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.borrowETH(
          contracts.gnosis.aaveV3.poolV3,
          parseEther("1"),
          0
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.repayETH(
          contracts.gnosis.aaveV3.poolV3,
          parseEther("0.5"),
          wallets.avatar,
          { value: parseEther("0.5") }
        )
      ).not.toRevert()
    })

    it("deposit XDAI, borrow USDC and repay", async () => {
      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.depositETH(
          contracts.gnosis.aaveV3.poolV3,
          wallets.avatar,
          0,
          { value: parseEther("1000") }
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.poolV3.borrow(
          contracts.gnosis.usdc,
          parseUnits("100", 6),
          2,
          0,
          wallets.avatar
        )
      ).not.toRevert()

      await expect(
        kit.asMember.usdc.approve(
          contracts.gnosis.aaveV3.poolV3,
          parseUnits("50", 6)
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.poolV3.repay(
          contracts.gnosis.usdc,
          parseUnits("50", 6),
          2,
          wallets.avatar
        )
      ).not.toRevert()
    })

    // Roles Module testing without executing transactions
    // Test with ETH
    it("allows borrowing XDAI from avatar", async () => {
      await expect(
        kit.asMember.aaveV3.variableDebtWXDAI.approveDelegation(
          contracts.gnosis.aaveV3.wrappedTokenGatewayV3,
          parseEther("1")
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.borrowETH(
          contracts.gnosis.aaveV3.poolV3,
          parseEther("1"),
          0
        )
      ).toBeAllowed()
    })

    it("only allows repaying XDAI from avatar", async () => {
      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.repayETH(
          contracts.gnosis.aaveV3.poolV3,
          parseEther("1"),
          wallets.avatar,
          { value: parseEther("1") }
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.repayETH(
          contracts.gnosis.aaveV3.poolV3,
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
          contracts.gnosis.usdc,
          parseUnits("10000", 6),
          2,
          0,
          wallets.avatar
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.poolV3.borrow(
          contracts.gnosis.usdc,
          parseUnits("10000", 6),
          2,
          0,
          wallets.member
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows repaying USDC from avatar", async () => {
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
        kit.asMember.aaveV3.poolV3.repay(
          contracts.gnosis.usdc,
          parseUnits("10000", 6),
          2,
          wallets.avatar
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.poolV3.repay(
          contracts.gnosis.usdc,
          parseUnits("10000", 6),
          2,
          wallets.member
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
