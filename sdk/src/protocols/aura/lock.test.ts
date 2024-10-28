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
import { testKit } from "../../../test/kit"
import { parseEther } from "ethers/lib/utils"

describe("aura", () => {
  describe("stake", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.lock())
    })
    it("only allow lock, process expired locks and claim to avatar", async () => {
      await stealErc20(AURA, parseEther("1"), contracts.mainnet.balancer.vault)
      await expect(
        testKit.eth.usdc
          .attach(AURA)
          .approve(contracts.mainnet.aura.aura_locker, parseEther("1"))
      ).not.toRevert()

      await expect(
        testKit.eth.aura.aura_locker.lock(avatar.address, parseEther("1"))
      ).not.toRevert()
      await expect(
        testKit.eth.aura.aura_locker.lock(member.address, parseEther("1"))
      ).toBeForbidden(Status.ParameterNotAllowed)

      await expect(
        testKit.eth.aura.aura_locker["getReward(address)"](avatar.address)
      ).not.toRevert()
      await expect(
        testKit.eth.aura.aura_locker["getReward(address)"](member.address)
      ).toBeForbidden(Status.ParameterNotAllowed)

      await advanceTime(10200000) // 16 weeks and 5 days must pass for the tokens to be unlocked
      await expect(
        testKit.eth.aura.aura_locker.processExpiredLocks(true)
      ).not.toRevert()
    })
  })
})
