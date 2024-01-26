import { z } from "zod"
import ethTokens from "./_info"

const zToken = z.enum([
  ...ethTokens.map((token) => token.symbol),
  "DSR_sDAI",
  ...ethTokens.map((token) => token.token),
] as [string, string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: zToken.array(),
  }),

  borrow: z.object({
    targets: zToken.array(),
  }),
}
