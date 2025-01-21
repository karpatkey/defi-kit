import { z } from "zod"
import ethTokens from "./_ethInfo"
import gnoTokens from "./_gnoInfo"

const zEthTokenDeposit = z.enum([
  "ETH",
  "DSR_sDAI",
  "SKY_USDS",
  ...ethTokens.map((token) => token.symbol),
  ...ethTokens.map((token) => token.token),
] as [string, string, ...string[]])

const zEthTokenBorrow = z.enum([
  "ETH",
  ...ethTokens.map((token) => token.symbol),
  ...ethTokens.map((token) => token.token),
] as [string, string, ...string[]])

const zGnoTokenDeposit = z.enum([
  "XDAI",
  "DSR_sDAI",
  ...gnoTokens.map((token) => token.symbol),
  ...gnoTokens.map((token) => token.token),
] as [string, string, ...string[]])

const zGnoTokenBorrow = z.enum([
  "XDAI",
  ...gnoTokens.map((token) => token.symbol),
  ...gnoTokens.map((token) => token.token),
] as [string, string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: zEthTokenDeposit.array(),
  }),

  borrow: z.object({
    targets: zEthTokenBorrow.array(),
  }),

  stake: z.object({}),
}

export const gno = {
  deposit: z.object({
    targets: zGnoTokenDeposit.array(),
  }),

  borrow: z.object({
    targets: zGnoTokenBorrow.array(),
  }),
}
