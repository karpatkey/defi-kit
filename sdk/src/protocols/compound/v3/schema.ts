import { z } from "zod"
import ethComets from "./_info"
import { Token } from "./types"

const ethCollateralTokens = [
  ...new Set(
    ethComets
      .flatMap((comet) => comet.collateralTokens as readonly Token[])
      .flatMap((token) => [token.address, token.symbol])
  ),
]

const ethBorrowTokens = [
  ...new Set(
    ethComets.flatMap((comet) => [
      comet.borrowToken.symbol,
      comet.borrowToken.address,
    ])
  ),
]

const zComet = z.enum([
  ...ethComets.map((comet) => comet.symbol),
  ...ethComets.map((comet) => comet.address),
] as [string, string, ...string[]])

const zToken = z.enum([...ethCollateralTokens, ...ethBorrowTokens] as [
  string,
  string,
  ...string[]
])

const zBorrowToken = z.enum(ethBorrowTokens as [string, string, ...string[]])

// A borrow target may be a comet or a borrow token. Comets are accepted so
// that markets sharing a borrow token (USDC backs both cUSDCv3 and ciUSDCv3)
// can be addressed unambiguously - see findCometForBorrow in ./index.ts
const zBorrowTarget = z.union([zComet, zBorrowToken])

export const eth = {
  deposit: z.object({
    targets: zComet.array(),
    tokens: zToken.array().optional(),
  }),

  borrow: z.object({
    targets: zBorrowTarget.array(),
  }),
}
