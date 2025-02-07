import { z } from "zod"
import ethTokens from "./_ethCoreInfo"
import ethStakeTokens from "./_stakeTokens"
import ethDelegateTokens from "./_delegateTokens"
import { zx } from "../../../zx"

const zToken = z.enum([
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
