import { eth } from "."
import comets from "./_info"

/**
 * `borrow` accepts either a comet or a borrow token as a target. Resolution by
 * borrow token returns the *first* matching comet, which is only well defined
 * because of the order of `_info.ts` - and that order mirrors the hand-edited
 * `COMETS` list in `scripts/compound_v3.py`. Reordering it would silently
 * retarget existing policies written against a base token symbol, so the
 * mapping is asserted here rather than left to the generator.
 */
describe("compoundV3", () => {
  describe("borrow target resolution", () => {
    type BorrowTarget = Parameters<typeof eth.borrow>[0]["targets"][number]

    const targetsOf = async (target: BorrowTarget) => {
      const permissions = await eth.borrow({ targets: [target] })
      return new Set(
        permissions.map((permission) => permission.targetAddress.toLowerCase())
      )
    }

    // Checksummed, so they are valid `targets` inputs; compared lowercased.
    const cUsdcV3 = "0xc3d688B66703497DAA19211EEdff47f25384cdc3"
    const ciUsdcV3 = "0x207158a267CBD2598BB3d611D8CBdEE2709F2F8C"
    const lower = (address: string) => address.toLowerCase()

    it("resolves an ambiguous base token to the first matching comet", async () => {
      // USDC is the base token of both cUSDCv3 and ciUSDCv3. Existing policies
      // are written against "USDC" and must keep resolving to cUSDCv3.
      const targets = await targetsOf("USDC")
      expect(targets).toContain(lower(cUsdcV3))
      expect(targets).not.toContain(lower(ciUsdcV3))
    })

    it("resolves a comet symbol to that comet", async () => {
      expect(await targetsOf("cUSDCv3")).toContain(lower(cUsdcV3))

      // Only reachable by naming the comet: its base token is USDC, which
      // resolves to cUSDCv3 above.
      const institutional = await targetsOf("ciUSDCv3")
      expect(institutional).toContain(lower(ciUsdcV3))
      expect(institutional).not.toContain(lower(cUsdcV3))
    })

    it("resolves a comet address to that comet", async () => {
      expect(await targetsOf(ciUsdcV3)).toContain(lower(ciUsdcV3))
    })

    it("resolves every comet by its own symbol", async () => {
      for (const comet of comets) {
        expect(await targetsOf(comet.symbol as BorrowTarget)).toContain(
          comet.address.toLowerCase()
        )
      }
    })

    it("throws for an unknown target", async () => {
      await expect(
        eth.borrow({ targets: ["NOT_A_MARKET" as BorrowTarget] })
      ).rejects.toThrow("Comet not found: NOT_A_MARKET")
    })
  })
})
