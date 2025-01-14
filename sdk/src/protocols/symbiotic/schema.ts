import { z } from "zod"
import ethPools from "./_ethPools"

const zEthPool = z.enum([
  ...ethPools.map((pool) => pool.token.symbol),
  ...ethPools.map((pool) => pool.token.address),
] as [string, string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: zEthPool.array(),
  }),
  withdraw: z.object({
    targets: zEthPool.array(),
  }),
}
