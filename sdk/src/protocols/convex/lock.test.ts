import { eth } from "."
import { CVX } from "./actions"
import { avatar, member } from "../../../test/wallets"
import {
  applyPermissions,
  stealErc20,
  advanceTime,
} from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import kit from "../../../test/kit"
import { parseEther } from "ethers"

describe("convex", () => {
  describe("stake", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.lock())
    })
    it("only allow lock, process expired locks and claim to avatar", async () => {
      await stealErc20(CVX, parseEther("1"), contracts.mainnet.balancer.vault)
      await expect(
        kit.asMember.usdc
          .attach(CVX)
          .approve(contracts.mainnet.convex.vlCVX, parseEther("1"))
      ).not.toRevert()

      await expect(
        kit.asMember.convex.vlCVX.lock(avatar.address, parseEther("1"), 0)
      ).not.toRevert()
      await expect(
        kit.asMember.convex.vlCVX.lock(member.address, parseEther("1"), 0)
      ).toBeForbidden(Status.ParameterNotAllowed)

      await expect(
        kit.asMember.convex.vlCVX["getReward(address,bool)"](
          avatar.address,
          false
        )
      ).not.toRevert()
      await expect(
        kit.asMember.convex.vlCVX["getReward(address,bool)"](
          member.address,
          false
        )
      ).toBeForbidden(Status.ParameterNotAllowed)

      await advanceTime(10300000) // 16 weeks and 6 days must pass for the tokens to be unlocked
      await expect(
        kit.asMember.convex.vlCVX.processExpiredLocks(true)
      ).not.toRevert()
    }, 90000) // Added 90 seconds of timeout because the lock takes too long and the test fails.
  })
})
