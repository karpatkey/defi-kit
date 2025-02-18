import { z } from "zod"
import _ethPools from "./_ethPools"
// import _ethBluePools from "./_ethBluePools"

const zEthPool = z.enum([
  ..._ethPools.map((pool) => pool.name),
  ..._ethPools.map((pool) => pool.address),
] as [string, string, ...string[]])

// const zEthBluePool = z.enum([..._ethBluePools.map((pool) => pool.marketId)] as [
//   string,
//   string,
//   ...string[]
// ])

export const eth = {
  deposit: z.object({
    targets: zEthPool.array(),
    // blueTargets: zEthBluePool.array(),
  }),
  withdraw: z.object({
    targets: zEthPool.array(),
    // tblueTargets: zEthBluePool.array(),
  }),
}
