import { z } from "zod"
import arb1Tokens from "./_baseInfo"
import baseTokens from "./_baseInfo"
import ethTokens from "./_ethInfo"

const zArb1TokenDeposit = z.enum([
  ...arb1Tokens.map((token) => token.symbol),
  ...arb1Tokens.map((token) => token.token),
] as [string, string, ...string[]])

const zBaseTokenDeposit = z.enum([
  ...baseTokens.map((token) => token.symbol),
  ...baseTokens.map((token) => token.token),
] as [string, string, ...string[]])

const zEthTokenDeposit = z.enum([
  ...ethTokens.map((token) => token.symbol),
  ...ethTokens.map((token) => token.token),
] as [string, string, ...string[]])

export const arb1 = {
  deposit: z.object({
    targets: zArb1TokenDeposit.array(),
  }),
}

export const base = {
  deposit: z.object({
    targets: zBaseTokenDeposit.array(),
  }),
}

export const eth = {
  deposit: z.object({
    targets: zEthTokenDeposit.array(),
  }),
}
