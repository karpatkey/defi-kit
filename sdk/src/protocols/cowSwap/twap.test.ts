import { eth } from "."
import { wallets } from "../../../test/wallets"
import { applyPermissions } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { eth as kit } from "../../../test/kit"
import { Chain } from "../.."

describe("cowSwap", () => {
  describe("TWAP", () => {
    beforeAll(async () => {
      await applyPermissions(
        Chain.eth,
        await eth.swap({
          sell: [contracts.mainnet.weth],
          buy: [contracts.mainnet.usdc],
          twap: true,
          recipient: wallets.avatar as `0x${string}`,
        })
      )
    })

    it("TWAP Order", async () => {
      await expect(
        kit.asMember.cowSwap.composableCow.createWithContext(
          {
            handler: "0x6cF1e9cA41f7611dEf408122793c358a3d11E5a5",
            salt: "0x0000000000000000000000000000000000000000000000000000001987624434",
            staticInput:
              "0x000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" + // sellToken
              "000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" + // buyToken
              "000000000000000000000000def1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + // receiver
              "00000000000000000000000000000000000000000000000006f05b59d3b20000" + // partSellAmount
              "000000000000000000000000000000000000000000000000000000006ddf6246" + // minPartLimit
              "0000000000000000000000000000000000000000000000000000000000000000" + // t0
              "0000000000000000000000000000000000000000000000000000000000000002" + // n
              "0000000000000000000000000000000000000000000000000000000000000708" + // t
              "0000000000000000000000000000000000000000000000000000000000000000" + // span
              "fa5a7084bee4877eca2501fec8947b1e20d309261130d584f3e7f591bc76315c",
          },
          "0x52eD56Da04309Aca4c3FECC595298d80C2f16BAc",
          "0x",
          true
        )
      ).toBeAllowed()
    })
  })
})
