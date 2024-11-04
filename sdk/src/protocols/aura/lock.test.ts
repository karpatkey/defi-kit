import { eth } from "."
import { AURA } from "./actions"
import { avatar, member } from "../../../test/wallets"
import {
  applyPermissions,
  stealErc20,
  advanceTime,
} from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { eth as kit } from "../../../test/kit"
import { parseEther } from "ethers"

describe("aura", () => {
  describe("stake", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.lock())
    })
    it("only allow lock, process expired locks and claim to avatar", async () => {
      await stealErc20(AURA, parseEther("1"), contracts.mainnet.balancer.vault)
      await expect(
        kit.asMember.usdc
          .attach(AURA)
          .approve(contracts.mainnet.aura.vlAura, parseEther("1"))
      ).not.toRevert()

      await expect(
        kit.asMember.aura.vlAura.lock(avatar.address, parseEther("1"))
      ).not.toRevert()
      await expect(
        kit.asMember.aura.vlAura.lock(member.address, parseEther("1"))
      ).toBeForbidden(Status.ParameterNotAllowed)

      await expect(
        kit.asMember.aura.vlAura["getReward(address)"](avatar.address)
      ).not.toRevert()
      await expect(
        kit.asMember.aura.vlAura["getReward(address)"](member.address)
      ).toBeForbidden(Status.ParameterNotAllowed)

      await advanceTime(10200000) // 16 weeks and 5 days must pass for the tokens to be unlocked
      await expect(
        kit.asMember.aura.vlAura.processExpiredLocks(true)
      ).not.toRevert()
    })
  })
})
