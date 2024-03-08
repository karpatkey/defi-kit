import { eth } from "."
import { avatar, member } from "../../../../test/wallets"
import { applyPermissions } from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { mintNFT } from "../../uniswap_v3/test_utils"

const E_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

describe("stakewise_v2", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(
        await eth.deposit({ targets: ["ETH-sETH2 0.3%"] })
      )
    })

    it("mint new position with permitted stakewise pool features", async () => {
      await expect(
        mintNFT(
          E_ADDRESS,
          contracts.mainnet.stakewise_v2.seth2,
          3000,
          1000000000000000000000n,
          0n,
          true,
          "0x56556075Ab3e2Bb83984E90C52850AFd38F20883"
        )
      ).not.toRevert()
    }, 30000)
  })
})