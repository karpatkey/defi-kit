import { arb1 } from "."
import { avatar, member } from "../../../../test/wallets"
import { applyPermissions } from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { Status } from "../../../../test/types"
import { arb1 as kit } from "../../../../test/kit"
import { parseEther } from "ethers"

describe("aaveV3", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(await arb1.deposit({ targets: ["ETH", "WETH"] }))
    })

    // Test with ETH
    it("only allows depositing ETH on behalf of avatar", async () => {
      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.depositETH(
          contracts.arbitrumOne.aaveV3.lendingPoolV3,
          avatar.address,
          0,
          { value: parseEther("1") }
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.depositETH(
          contracts.arbitrumOne.aaveV3.lendingPoolV3,
          member.address,
          0,
          { value: parseEther("1") }
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows withdrawing ETH from avatars' position", async () => {
      await expect(
        kit.asMember.aaveV3.aArbWeth.approve(
          contracts.arbitrumOne.aaveV3.wrappedTokenGatewayV3,
          parseEther("1")
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.withdrawETH(
          contracts.arbitrumOne.aaveV3.lendingPoolV3,
          parseEther("1"),
          avatar.address
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayV3.withdrawETH(
          contracts.arbitrumOne.aaveV3.lendingPoolV3,
          parseEther("1"),
          member.address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    // Test with WETH
    it("only allows depositing WETH on behalf of avatar", async () => {
      await expect(
        kit.asMember.weth.approve(
          contracts.arbitrumOne.aaveV3.lendingPoolV3,
          parseEther("1")
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.lendingPoolV3.supply(
          contracts.arbitrumOne.weth,
          parseEther("1"),
          avatar.address,
          0
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.lendingPoolV3.supply(
          contracts.arbitrumOne.weth,
          parseEther("1"),
          member.address,
          0
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("allow withdrawing WETH", async () => {
      await expect(
        kit.asMember.aaveV3.lendingPoolV3["withdraw(bytes32)"](
          "0x0000000000000000000000000000ffffffffffffffffffffffffffffffff0004"
        )
      ).toBeAllowed()
    })
  })
})
