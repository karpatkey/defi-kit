import { z } from "zod"
import ethPools from "./_info"
import ethStakeTokens from "./stakeTokens"

const zPool = z.enum([
  ...ethPools.map((pool) => pool.name),
  ...ethPools.map((pool) => pool.crvLPToken),
  ...ethPools.map((pool) => pool.id),
] as [string, string, ...string[]])

const zStakeToken = z.enum([
  ...ethStakeTokens.map((token) => token.address),
  ...ethStakeTokens.map((token) => token.symbol),
] as [string, string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: zPool.array(),
  }),

  stake: z.object({
    targets: zStakeToken.array(),
  }),

  lock: z.object({}),
}
