import { eth } from "."
import { wallets } from "../../../test/wallets"
import { applyPermissions } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { eth as kit } from "../../../test/kit"
import { Chain } from "../.."

const TWAP_HANDLER = "0x6cF1e9cA41f7611dEf408122793c358a3d11E5a5"
const CURRENT_BLOCK_TIMESTAMP_FACTORY =
  "0x52eD56Da04309Aca4c3FECC595298d80C2f16BAc"

const pinnedAppData =
  "0xfa5a7084bee4877eca2501fec8947b1e20d309261130d584f3e7f591bc76315c" as `0x${string}`

// TWAPOrder.Data: 10 static words. Only sellToken/buyToken/receiver were
// inspected before; appData sits in the trailing word at index 9.
const staticInput = (appData: string) =>
  "0x000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" + // sellToken  WETH
  "000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" + // buyToken   USDC
  "000000000000000000000000def1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + // receiver   avatar
  "00000000000000000000000000000000000000000000000006f05b59d3b20000" + // partSellAmount
  "000000000000000000000000000000000000000000000000000000006ddf6246" + // minPartLimit
  "0000000000000000000000000000000000000000000000000000000000000000" + // t0
  "0000000000000000000000000000000000000000000000000000000000000002" + // n
  "0000000000000000000000000000000000000000000000000000000000000708" + // t
  "0000000000000000000000000000000000000000000000000000000000000000" + // span
  appData.replace(/^0x/, "")

describe("cowSwap", () => {
  describe("TWAP appData scoping", () => {
    beforeAll(async () => {
      await applyPermissions(
        Chain.eth,
        await eth.swap({
          sell: [contracts.mainnet.weth],
          buy: [contracts.mainnet.usdc],
          twap: true,
          receiver: wallets.avatar as `0x${string}`,
          appData: pinnedAppData,
        })
      )
    })

    it("allows a TWAP order carrying the pinned appData", async () => {
      await expect(
        kit.asMember.cowSwap.composableCow.createWithContext(
          {
            handler: TWAP_HANDLER,
            salt: "0x0000000000000000000000000000000000000000000000000000001987624434",
            staticInput: staticInput(pinnedAppData),
          },
          CURRENT_BLOCK_TIMESTAMP_FACTORY,
          "0x",
          true
        )
      ).toBeAllowed()
    })

    it("forbids a TWAP order with any other appData", async () => {
      await expect(
        kit.asMember.cowSwap.composableCow.createWithContext(
          {
            handler: TWAP_HANDLER,
            salt: "0x0000000000000000000000000000000000000000000000000000001987624434",
            staticInput: staticInput(
              "0x1111111111111111111111111111111111111111111111111111111111111111"
            ),
          },
          CURRENT_BLOCK_TIMESTAMP_FACTORY,
          "0x",
          true
        )
      ).toBeForbidden()
    })
  })
})
