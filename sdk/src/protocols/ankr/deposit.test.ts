import { eth } from "."
import { applyPermissions } from "../../../test/helpers"
import { wallets } from "../../../test/wallets"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { eth as kit } from "../../../test/kit"
import { parseEther } from "ethers"
import { Chain } from ".../../../src"

// Skipped: Ankr paused staking and unstaking on its ETH2Staking contract
// between blocks 26,360,000 (7 Nov 2026, still working) and 26,380,000
// (9 Nov 2026, paused). Reproduced against a mainnet fork:
//
//   stakeAndClaimAethC()  -> reverted: "This action currently paused"
//   unstakeAETH(1e18)     -> reverted: "This action currently paused"
//
// The third case then fails as a cascade, since no ankrETH can be acquired
// to swap. ankrETH itself is still live, so this is the protocol being
// unavailable rather than a problem with the permissions we generate.
//
// These tests fork at latest, so they will keep failing until Ankr unpauses.
// Un-skip once `stakeAndClaimAethC` succeeds on a fresh fork again; if Ankr
// is being wound down for good, delete this suite and the CI shard as was
// done for Aura.
describe.skip("ankr", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(Chain.eth, await eth.deposit())
    })

    it("deposit ETH", async () => {
      await expect(
        kit.asMember.ankr.eth2Staking.stakeAndClaimAethC({
          value: parseEther("5"),
        })
      ).not.toRevert()
    })

    it("only withdraw with flash unstake to avatar", async () => {
      await expect(
        kit.asMember.ankr.ankrEth.approve(
          contracts.mainnet.ankr.flashUnstake,
          parseEther("1")
        )
      ).toBeAllowed()
      await expect(
        kit.asMember.ankr.flashUnstake.swapEth(
          parseEther("0.000001"),
          wallets.avatar
        )
      ).not.toRevert()
      await expect(
        kit.asMember.ankr.flashUnstake.swapEth(
          parseEther("0.01"),
          wallets.member
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("withdraw with standard unstake", async () => {
      await expect(
        kit.asMember.ankr.eth2Staking.unstakeAETH(parseEther("1"))
      ).not.toRevert()
    })
  })
})
