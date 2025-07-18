import { z } from "zod"
import _ethPools from "./_ethVaults"
import _basePools from "./_baseVaults"
import { zx } from "../../zx"

const MarketParamsSchema = z.object({
  loanToken: zx.address(),
  collateralToken: zx.address(),
  oracle: zx.address(),
  irm: zx.address(),
  lltv: z.union([z.string(), z.number(), z.bigint()]), // BigNumberish can be a string, number, or bigint
})

const zEthPool = z.enum([
  ..._ethPools.map((pool) => pool.name),
  ..._ethPools.map((pool) => pool.address),
] as [string, string, ...string[]])

const zBasePool = z.enum([
  ..._basePools.map((pool) => pool.name),
  ..._basePools.map((pool) => pool.address),
] as [string, string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: zEthPool.array(),
  }),
  borrow: z.object({
    targets: MarketParamsSchema.array(),
  }),
  supply: z.object({
    targets: MarketParamsSchema.array(),
  }),
}

export const base = {
  deposit: z.object({
    targets: zBasePool.array(),
  }),
  borrow: z.object({
    targets: MarketParamsSchema.array(),
  }),
  supply: z.object({
    targets: MarketParamsSchema.array(),
  }),
}
