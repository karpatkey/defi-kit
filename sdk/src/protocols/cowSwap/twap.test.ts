import { Operator } from "zodiac-roles-sdk"
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
          receiver: wallets.avatar as `0x${string}`,
        })
      )
    })

    // `buy` is documented as optional on both paths, but on the TWAP path
    // omitting it used to throw `updatedBuy is not iterable`. Builds only — no
    // permissions are applied, so this does not disturb the suite's scoping.
    it("builds permissions when `buy` is omitted, leaving buyToken unscoped", async () => {
      const permissions = await eth.swap({
        sell: [contracts.mainnet.weth],
        twap: true,
        receiver: wallets.avatar as `0x${string}`,
      })

      // createWithContext((address,bytes32,bytes),address,bytes,bool)
      const createWithContext = permissions.find(
        (p: any) => p.selector === "0x0d0d9800"
      ) as any
      expect(createWithContext).toBeDefined()

      // params[0].staticInput, i.e. the abi-encoded TWAP struct
      const staticInput = createWithContext.condition.children[0].children[2]
      expect(staticInput.children).toHaveLength(10)

      // Asserting Pass specifically: a plain length check would still pass if a
      // future edit pinned buyToken to, say, the zero address.
      expect(staticInput.children[1].operator).toBe(Operator.Pass)
      expect(staticInput.children[1].compValue).toBeUndefined()
      // ...while sellToken is still constrained.
      expect(staticInput.children[0].operator).not.toBe(Operator.Pass)
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
