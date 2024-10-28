import { eth } from "."
import { avatar, member } from "../../../test/wallets"
import { applyPermissions, advanceTime } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import kit from "../../../test/kit"
import { parseEther } from "ethers"

describe("lido", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit())
    })

    it("allows submitting ETH", async () => {
      await expect(
        kit.asMember.lido.steth.submit(avatar.address, {
          value: parseEther("10"),
        })
      ).not.toRevert()
    })

    it("allows wrapping and unwrapping stETH", async () => {
      await expect(
        kit.asMember.lido.steth.approve(
          contracts.mainnet.lido.wsteth,
          parseEther("5")
        )
      ).not.toRevert()
      await expect(
        kit.asMember.lido.wsteth.wrap(parseEther("5"))
      ).not.toRevert()
      await expect(
        kit.asMember.lido.wsteth.unwrap(parseEther("1"))
      ).not.toRevert()
    })

    it("only allows requesting withdrawals from avatar's positions", async () => {
      await expect(
        kit.asMember.lido.steth.approve(
          contracts.mainnet.lido.unsteth,
          parseEther("1")
        )
      ).not.toRevert()
      await advanceTime(2)
      await expect(
        kit.asMember.lido.unsteth.requestWithdrawals(
          [parseEther("1")],
          avatar.address
        )
      ).not.toRevert()

      await expect(
        kit.asMember.lido.wsteth.approve(
          contracts.mainnet.lido.unsteth,
          parseEther("1")
        )
      ).not.toRevert()
      await advanceTime(2)
      await expect(
        kit.asMember.lido.unsteth.requestWithdrawalsWstETH(
          [parseEther("1")],
          avatar.address
        )
      ).not.toRevert()

      await expect(
        kit.asMember.lido.unsteth.requestWithdrawals(
          [parseEther("1")],
          member.address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        kit.asMember.lido.unsteth.requestWithdrawalsWstETH(
          [parseEther("1")],
          member.address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
