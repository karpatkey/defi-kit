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
      comet.borrowToken.address,
      comet.borrowToken.symbol,
    ])
  ),
]

const zComet = z.enum([
  ...ethComets.map((comet) => comet.address),
  ...ethComets.map((comet) => comet.symbol),
] as [string, string, ...string[]])

const zToken = z.enum([...ethCollateralTokens, ...ethBorrowTokens] as [
  string,
  string,
  ...string[]
])

const zBorrowToken = z.enum(ethBorrowTokens as [string, string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: zComet.array(),
    tokens: zToken.array().optional(),
  }),

  borrow: z.object({
    targets: zBorrowToken.array(),
  }),
}
