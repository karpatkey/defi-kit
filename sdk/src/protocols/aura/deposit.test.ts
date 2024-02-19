import { eth, gno } from "."
import { AURA } from "./actions"
import { avatar, member } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { testKit } from "../../../test/kit"
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { parseEther } from "ethers/lib/utils"

const sdk = getMainnetSdk(avatar)
const b_50WETH_50AURA = "0xCfCA23cA9CA720B6E98E3Eb9B6aa0fFC4a5C08B9"
const b_50WETH_50AURA_pid =
  "0xcfca23ca9ca720b6e98e3eb9b6aa0ffc4a5c08b9000200000000000000000274"
const aura_50WETH_50AURA_rewarder = "0x1204f5060bE8b716F5A62b4Df4cE32acD01a69f5"

describe("aura", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      // Aura 50WETH-50AURA
      await applyPermissions(await eth.deposit({ targets: ["100"] }))
    })
    it("deposit and withdraw bpt from pool, only claim to avatar", async () => {
      await stealErc20(
        b_50WETH_50AURA,
        parseEther("1"),
        contracts.mainnet.aura.booster
      )
      await expect(
        testKit.eth.usdc
          .attach(b_50WETH_50AURA)
          .approve(contracts.mainnet.aura.booster, parseEther("1"))
      ).not.toRevert()

      await expect(
        testKit.eth.aura.booster.deposit(100, parseEther("1"), true)
      ).not.toRevert()
      await expect(
        testKit.eth.aura.booster.deposit(99, parseEther("1"), true)
      ).toBeForbidden(Status.ParameterNotAllowed)

      await expect(
        testKit.eth.aura.rewarder
          .attach(aura_50WETH_50AURA_rewarder)
          .withdrawAndUnwrap(parseEther("1"), false)
      ).not.toRevert()

      await expect(
        testKit.eth.aura.rewarder
          .attach(aura_50WETH_50AURA_rewarder)
          ["getReward(address,bool)"](avatar._address, true)
      ).not.toRevert()
      await expect(
        testKit.eth.aura.rewarder
          .attach(aura_50WETH_50AURA_rewarder)
          ["getReward(address,bool)"](member._address, true)
      ).toBeForbidden(Status.ParameterNotAllowed)
    }, 60000) // Added 60 seconds of timeout because the deposit takes too long and the test fails.

    it("deposit single token, withdraw bpt from pool", async () => {
      await sdk.weth.deposit({ value: parseEther("1") })
      await expect(
        testKit.eth.weth.approve(
          contracts.mainnet.aura.reward_pool_deposit_wrapper,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aura.reward_pool_deposit_wrapper.depositSingle(
          aura_50WETH_50AURA_rewarder,
          contracts.mainnet.weth,
          parseEther("1"),
          b_50WETH_50AURA_pid,
          {
            assets: [contracts.mainnet.weth, AURA],
            maxAmountsIn: [parseEther("1"), 0],
            userData:
              "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000000",
            fromInternalBalance: false,
          }
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aura.reward_pool_deposit_wrapper.depositSingle(
          aura_50WETH_50AURA_rewarder,
          contracts.mainnet.usdc, // USDC not allowed
          parseEther("1"),
          b_50WETH_50AURA_pid,
          {
            assets: [contracts.mainnet.weth, AURA],
            maxAmountsIn: [parseEther("1"), 0],
            userData:
              "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000000",
            fromInternalBalance: false,
          }
        )
      ).toBeForbidden()
    })
  })

  it("gno pool search", async () => {
    await gno.deposit({ targets: ["15"] })
  })
})
