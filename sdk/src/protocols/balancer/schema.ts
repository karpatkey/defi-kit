import { z } from "zod"
import ethPools from "./_info"
import { Token } from "./types"

const ethTokens = [
  ...new Set(
    ethPools
      .flatMap((pool) => pool.tokens as readonly Token[])
      .flatMap((token) => [token.address, token.symbol])
  ),
]

const zPool = z.enum([
  ...ethPools.map((pool) => pool.name),
  ...ethPools.map((pool) => pool.bpt),
  ...ethPools.map((pool) => pool.id),
] as [string, string, ...string[]])

const zToken = z.enum(ethTokens as [string, string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: zPool.array(),
    tokens: zToken.array().optional(),
  }),

  stake: z.object({
    targets: zPool.array(),
  }),

  // lock: z.object({}),

  swap: z.object({
    sell: zToken.array().optional(),
    buy: zToken.array().optional(),
    pools: zPool.array().optional(),
  }),
}
