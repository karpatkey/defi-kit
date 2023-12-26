import { z } from "zod"
import ethTokens from "./_info"
import ethDelegateTokens from "./delegateTokens"
import ethStakeTokens from "./stakeTokens"
import { zx } from "../../../zx"

const zToken = z.enum([
  ...ethTokens.map((token) => token.token),
  ...ethTokens.map((token) => token.symbol),
] as [string, string, ...string[]])

const zDelegateToken = z.enum([
  ...ethDelegateTokens.map((token) => token.address),
  ...ethDelegateTokens.map((token) => token.symbol),
] as [string, string, ...string[]])

const zDelegatee = zx.address()

const zStakeToken = z.enum([
  ...ethStakeTokens.map((token) => token.address),
  ...ethStakeTokens.map((token) => token.symbol),
] as [string, string, ...string[]])

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
