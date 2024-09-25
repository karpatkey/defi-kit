import { z } from "zod"
import ethTokens from "./_ethInfo"
import gnoTokens from "./_gnoInfo"

const zEthTokenDeposit = z.enum([
  ...ethTokens.map((token) => token.symbol),
  "DSR_sDAI",
  "ETH",
  ...ethTokens.map((token) => token.token),
] as [string, string, ...string[]])

const zEthTokenBorrow = z.enum([
  ...ethTokens.map((token) => token.symbol),
  "ETH",
  ...ethTokens.map((token) => token.token),
] as [string, string, ...string[]])

const zGnoTokenDeposit = z.enum([
  ...gnoTokens.map((token) => token.symbol),
  "DSR_sDAI",
  "XDAI",
  ...gnoTokens.map((token) => token.token),
] as [string, string, ...string[]])

const zGnoTokenBorrow = z.enum([
  ...gnoTokens.map((token) => token.symbol),
  "XDAI",
  ...gnoTokens.map((token) => token.token),
] as [string, string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: zEthTokenDeposit.array(),
  }),

  borrow: z.object({
    targets: zEthTokenBorrow.array(),
  }),
}

export const gno = {
  deposit: z.object({
    targets: zGnoTokenDeposit.array(),
  }),

  borrow: z.object({
    targets: zGnoTokenBorrow.array(),
  }),
}
