import { eth } from "."
import { applyPermissions } from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { mintNFT } from "../../uniswap/v3/testUtils"

const STEAL_ADDRESS = "0x56556075Ab3e2Bb83984E90C52850AFd38F20883"
const E_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

describe("stakewise_v2", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit({ targets: ["ETH-sETH2 0.3%"] }))
    })

    // TODO: fix this test
    it.skip("mint new position with permitted stakewise pool features", async () => {
      await expect(
        mintNFT(
          E_ADDRESS,
          contracts.mainnet.stakewise_v2.seth2,
          3000,
          1000000000000000000000n,
          0n,
          true,
          STEAL_ADDRESS
        )
      ).not.toRevert()
      await expect(
        mintNFT(
          E_ADDRESS,
          contracts.mainnet.usdt, // invalid token
          3000,
          1000000000000000000000n,
          0n,
          true
        )
      ).toBeForbidden()
      await expect(
        mintNFT(
          E_ADDRESS,
          contracts.mainnet.stakewise_v2.seth2,
          500, // invalid fee
          1000000000000000000000n,
          0n,
          true,
          STEAL_ADDRESS
        )
      ).toBeForbidden()
    }, 30000)
  })
})
