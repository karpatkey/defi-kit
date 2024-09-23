import { z } from "zod"
import ethTokens from "./_info"

const zTokenDeposit = z.enum([
  ...ethTokens.map((token) => token.symbol),
  "DSR_sDAI",
  "ETH",
  ...ethTokens.map((token) => token.token),
] as [string, string, ...string[]])

const zTokenBorrow = z.enum([
  ...ethTokens.map((token) => token.symbol),
  "ETH",
  ...ethTokens.map((token) => token.token),
] as [string, string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: zTokenDeposit.array(),
  }),

  borrow: z.object({
    targets: zTokenBorrow.array(),
  }),
}
