import { eth } from "."
import { applyPermissions } from "../../../test/helpers"
import { avatar, member } from "../../../test/wallets"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { eth as kit } from "../../../test/kit"
import { parseEther } from "ethers"

describe("stader", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit())
    })

    it("only deposit ETH on behalf of avatar", async () => {
      await expect(
        kit.asMember.stader.stakingPoolManager["deposit(address)"](
          avatar.address,
          {
            value: parseEther("5"),
          }
        )
      ).not.toRevert()
      await expect(
        kit.asMember.stader.stakingPoolManager["deposit(address)"](
          member.address,
          {
            value: parseEther("5"),
          }
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only withdraw to avatar", async () => {
      await expect(
        kit.asMember.stader.ethx.approve(
          contracts.mainnet.stader.userWithdrawManager,
          parseEther("1")
        )
      ).not.toRevert()
      await expect(
        kit.asMember.stader.userWithdrawManager[
          "requestWithdraw(uint256,address)"
        ](parseEther("1"), avatar.address)
      ).not.toRevert()
      await expect(
        kit.asMember.stader.userWithdrawManager[
          "requestWithdraw(uint256,address)"
        ](parseEther("1"), member.address)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("claim withdrawal request through roles", async () => {
      await expect(
        kit.asMember.stader.userWithdrawManager.claim(665)
      ).toBeAllowed()
    })
  })
})
