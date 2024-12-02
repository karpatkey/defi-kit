import { z } from "zod"
import ethPools from "./_ethPools"

const zEthPool = z.enum([
  ...ethPools.map((pool) => pool.name),
  ...ethPools.map((pool) => pool.address),
] as [string, string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: zEthPool.array(),
  }),
  stake: z.object({}),
}
