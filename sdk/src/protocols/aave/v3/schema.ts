import { z } from "zod"
import ethTokens from "./_info"
import ethStakeTokens from "../v2/stakeTokens"
import ethDelegateTokens from "../v2/delegateTokens"
import { zx } from "../../../zx"

const zToken = z.enum([
  ...ethTokens.map((token) => token.token),
  ...ethTokens.map((token) => token.symbol),
] as [string, string, ...string[]])

const zStakeToken = z.enum([
  ...ethStakeTokens.map((token) => token.address),
  ...ethStakeTokens.map((token) => token.symbol),
] as [string, string, ...string[]])

const zDelegateToken = z.enum([
  ...ethDelegateTokens.map((token) => token.address),
  ...ethDelegateTokens.map((token) => token.symbol),
] as [string, string, ...string[]])

const zDelegatee = zx.address()

export const eth = {
  deposit: z.object({
    targets: zToken.array(),
  }),

  borrow: z.object({
    targets: zToken.array(),
  }),

  stake: z.object({
    targets: zStakeToken.array(),
  }),

  delegate: z.object({
    targets: zDelegateToken.array(),
    delegatee: zDelegatee,
  }),
}
