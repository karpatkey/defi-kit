import { eth } from "."
import { BAL, B_80BAL_20WETH, B_80BAL_20WETH_PID, bb_a_USD_v1, bb_a_USD_v2, bb_a_USD_v3 } from "./actions"
import { contracts } from "../../../eth-sdk/config"
import { avatar, member } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { testKit } from "../../../test/kit"
import { parseEther } from "ethers/lib/utils"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

describe("balancer", () => {
  describe("lock", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.lock())
    })

    it("deposit and withdraw from B-80BAL-20WETH pool", async () => {
      await expect(
        testKit.eth.balancer.vault.joinPool(
          B_80BAL_20WETH_PID,
          avatar._address,
          avatar._address,
          {
            assets: [BAL, ZERO_ADDRESS],
            maxAmountsIn: [0, parseEther("1")],
            userData: "0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de0b6b3a7640000",
            fromInternalBalance: false
          },
          { value: parseEther("1") }
        )
      ).not.toRevert()

      await expect(
        testKit.eth.balancer.vault.exitPool(
          B_80BAL_20WETH_PID,
          avatar._address,
          avatar._address,
          {
            assets: [BAL, contracts.mainnet.weth],
            minAmountsOut: [0, 0],
            userData: "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001",
            toInternalBalance: false
          }
        )
      ).not.toRevert()
    })
  })
})