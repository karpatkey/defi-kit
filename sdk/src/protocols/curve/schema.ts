import { z } from "zod"
import ethPools from "./pools/eth"

const ethTokens = [...new Set(ethPools.flatMap((pool) => pool.tokens))]

const zPool = z.enum([
  ...ethPools.map((pool) => pool.name),
  ...ethPools.map((pool) => pool.address),
] as [string, string, ...string[]])

const zToken = z.enum(ethTokens as [string, string, ...string[]])

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
