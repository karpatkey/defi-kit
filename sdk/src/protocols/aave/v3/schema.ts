import { z } from "zod"
import ethTokens from "./_ethInfo"
import gnoTokens from "./_ethInfo"
import ethStakeTokens from "../v2/stakeTokens"
import ethDelegateTokens from "../v2/delegateTokens"
import { zx } from "../../../zx"

const zEthToken = z.enum([
  "ETH",
  ...ethTokens.map((token) => token.symbol),
  ...ethTokens.map((token) => token.token),
] as [string, string, ...string[]])

const zStakeToken = z.enum([
  ...ethStakeTokens.map((token) => token.symbol),
  ...ethStakeTokens.map((token) => token.address),
] as [string, string, ...string[]])

const zDelegateToken = z.enum([
  ...ethDelegateTokens.map((token) => token.symbol),
  ...ethDelegateTokens.map((token) => token.address),
] as [string, string, ...string[]])

const zDelegatee = zx.address()

const zGnoToken = z.enum([
  "XDAI",
  ...gnoTokens.map((token) => token.symbol),
  ...gnoTokens.map((token) => token.token),
] as [string, string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: zEthToken.array(),
  }),

  borrow: z.object({
    targets: zEthToken.array(),
  }),

  stake: z.object({
    targets: zStakeToken.array(),
  }),

  delegate: z.object({
    targets: zDelegateToken.array(),
    delegatee: zDelegatee,
  }),
}

export const gno = {
  deposit: z.object({
    targets: zGnoToken.array(),
  }),

  borrow: z.object({
    targets: zGnoToken.array(),
  }),
}
