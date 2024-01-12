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
import { testKit } from "../../../test/kit"
import { parseEther } from "ethers/lib/utils"

describe("convex", () => {
  describe("stake", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.lock())
    })
    it("only allow lock, process expired locks and claim to avatar", async () => {
      await stealErc20(CVX, parseEther("1"), contracts.mainnet.balancer.vault)
      await expect(
        testKit.eth.usdc
          .attach(CVX)
          .approve(contracts.mainnet.convex.vlCVX, parseEther("1"))
      ).not.toRevert()

      await expect(
        testKit.eth.convex.vlCVX.lock(avatar._address, parseEther("1"), 0)
      ).not.toRevert()
      await expect(
        testKit.eth.convex.vlCVX.lock(member._address, parseEther("1"), 0)
      ).toBeForbidden(Status.ParameterNotAllowed)

      await expect(
        testKit.eth.convex.vlCVX["getReward(address,bool)"](
          avatar._address,
          false
        )
      ).not.toRevert()
      await expect(
        testKit.eth.convex.vlCVX["getReward(address,bool)"](
          member._address,
          false
        )
      ).toBeForbidden(Status.ParameterNotAllowed)

      await advanceTime(10200000) // 16 weeks and 6 days must pass for the tokens to be unlocked
      await expect(
        testKit.eth.convex.vlCVX.processExpiredLocks(true)
      ).not.toRevert()
    }, 30000) // Added 30 seconds of timeout because the lock takes too long and the test fails.
  })
})
