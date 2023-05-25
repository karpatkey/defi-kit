import { z } from "zod"
import ethPools from "./pools/eth"

const ethTokens = [...new Set(ethPools.flatMap((pool) => pool.tokens))]

const zPool = z.union([
  ...ethPools.map((pool) => z.literal(pool.name)),
  ...ethPools.map((pool) => z.literal(pool.address)),
] as any)

const zToken = z.union(ethTokens.map((address) => z.literal(address)) as any)

export const eth = {
  deposit: z.object({
    target: zPool,
  }),

  swap: z.object({
    sell: zToken.array().optional(),
    buy: zToken.array().optional(),
    pools: zPool.array().optional(),
  }),
}
