import { z } from "zod"
import ethTokens from "./_info"
import ethDelegateTokens from "./delegateTokens"
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

export const eth = {
  deposit: z.object({
    targets: zToken.array(),
  }),

  borrow: z.object({
    targets: zToken.array(),
  }),

  stake: z.object({}),

  delegate: z.object({
    targets: zDelegateToken.array(),
    delegatee: zDelegatee,
  }),
}
