import { eth } from "."
import { AURA } from "./actions"
import { avatar, member } from "../../../test/wallets"
import { applyPermissions, stealErc20, advanceTime } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { testKit } from "../../../test/kit"
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { parseEther } from "ethers/lib/utils"
import { getProvider } from "../../../test/provider"

const sdk = getMainnetSdk(avatar)

describe("aura", () => {
  describe("stake", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.lock())
    })
    it("only allow lock, process expired locks and claim to avatar", async () => {
      await stealErc20(
        AURA,
        parseEther("1"),
        contracts.mainnet.balancer.vault
      )
      await expect(
        testKit.eth.usdc.attach(AURA).approve(
          contracts.mainnet.aura.aura_locker,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aura.aura_locker.lock(
          avatar._address,
          parseEther("1")
        )
      ).not.toRevert()
      await expect(
        testKit.eth.aura.aura_locker.lock(
          member._address,
          parseEther("1")
        )
      ).toBeForbidden(Status.ParameterNotAllowed)

      await expect(
        testKit.eth.aura.aura_locker["getReward(address)"](
          avatar._address
        )
      ).not.toRevert()
      await expect(
        testKit.eth.aura.aura_locker["getReward(address)"](
          member._address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)

      // const provider = getProvider()
      // console.log(await provider.getBlockNumber())
      // advanceTime(170000)
      // console.log(await provider.getBlockNumber())
      await expect(
        testKit.eth.aura.aura_locker.processExpiredLocks(
          true
        )
      ).toBeAllowed()
    })
  })
})