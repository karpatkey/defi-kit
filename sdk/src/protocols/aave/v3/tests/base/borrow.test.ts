import { base } from "../../index"
import { wallets } from "../../../../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../../../../test/helpers"
import { contracts } from "../../../../../../eth-sdk/config"
import { Status } from "../../../../../../test/types"
import { base as kit } from "../../../../../../test/kit"
import { parseEther, parseUnits } from "ethers"
import { Chain } from "../../../../../index"

describe("aaveV3", () => {
  describe("borrow", () => {
    beforeAll(async () => {
      await applyPermissions(
        Chain.base,
        await base.deposit({ targets: ["ETH", "USDC"] })
      )
      await applyPermissions(
        Chain.base,
        await base.borrow({ targets: ["ETH", "USDC"] })
      )
    })

    it("deposit USDC", async () => {
      await stealErc20(
        Chain.base,
        contracts.base.usdc,
        parseUnits("10000", 6),
        contracts.base.balancerV2.vault
      )
      await expect(
        kit.asMember.usdc.approve(
          contracts.base.aaveV3.poolV3,
          parseUnits("10000", 6)
        )
      ).not.toRevert()
      await expect(
        kit.asMember.aaveV3.poolV3.supply(
          contracts.base.usdc,
          parseUnits("10000", 6),
          wallets.avatar,
          0
        )
      ).not.toRevert()
    })

    it("borrow ETH and repay", async () => {
      await expect(
        kit.asMember.aaveV3.variableDebtWeth.approveDelegation(
          contracts.base.aaveV3.wrappedTokenGatewayV3,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.borrowETH(
          contracts.base.aaveV3.poolV3,
          parseEther("1"),
          0
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.repayETH(
          contracts.base.aaveV3.poolV3,
          parseEther("1"),
          wallets.avatar,
          { value: parseEther("1") }
        )
      ).not.toRevert()
    })

    it("deposit ETH, borrow USDC and repay", async () => {
      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.depositETH(
          contracts.base.aaveV3.poolV3,
          wallets.avatar,
          0,
          { value: parseEther("1") }
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.poolV3.borrow(
          contracts.base.usdc,
          parseUnits("100", 6),
          2,
          0,
          wallets.avatar
        )
      ).not.toRevert()

      await expect(
        kit.asMember.usdc.approve(
          contracts.base.aaveV3.poolV3,
          parseUnits("100", 6)
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.poolV3.repay(
          contracts.base.usdc,
          parseUnits("100", 6),
          2,
          wallets.avatar
        )
      ).not.toRevert()
    })

    // Test with ETH
    it("allows borrowing ETH from avatar", async () => {
      await expect(
        kit.asMember.aaveV3.variableDebtWeth.approveDelegation(
          contracts.base.aaveV3.wrappedTokenGatewayV3,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.borrowETH(
          contracts.base.aaveV3.poolV3,
          parseEther("1"),
          0
        )
      ).not.toRevert()
    })

    it("only allows repaying ETH from avatar", async () => {
      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.repayETH(
          contracts.base.aaveV3.poolV3,
          parseEther("1"),
          wallets.avatar,
          { value: parseEther("1") }
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.repayETH(
          contracts.base.aaveV3.poolV3,
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
          contracts.base.usdc,
          parseUnits("100", 6),
          2,
          0,
          wallets.avatar
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.poolV3.borrow(
          contracts.base.usdc,
          parseUnits("100", 6),
          2,
          0,
          wallets.member
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows repaying USDC from avatar", async () => {
      await stealErc20(
        Chain.eth,
        contracts.base.usdc,
        parseUnits("100", 6),
        contracts.base.balancerV2.vault
      )

      await expect(
        kit.asMember.usdc.approve(
          contracts.base.aaveV3.poolV3,
          parseUnits("100", 6)
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.poolV3.repay(
          contracts.base.usdc,
          parseUnits("100", 6),
          2,
          wallets.avatar
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.poolV3.repay(
          contracts.base.usdc,
          parseUnits("100", 6),
          2,
          wallets.member
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
