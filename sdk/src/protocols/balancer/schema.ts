import { z } from "zod"
import ethPools from "./_ethPools"
import gnoPools from "./_gnoPools"
import { EthToken, GnoToken } from "./types"

const ethTokens = [
  ...new Set(
    ethPools
      .flatMap((pool) => pool.tokens as readonly EthToken[])
      .flatMap((token) => [token.address, token.symbol])
  ),
]
const gnoTokens = [
  ...new Set(
    gnoPools
      .flatMap((pool) => pool.tokens as readonly GnoToken[])
      .flatMap((token) => [token.address, token.symbol])
  ),
]

const zEthPool = z.enum([
  ...ethPools.map((pool) => pool.name),
  ...ethPools.map((pool) => pool.bpt),
  ...ethPools.map((pool) => pool.id),
] as [string, string, ...string[]])
const zGnoPool = z.enum([
  ...gnoPools.map((pool) => pool.name),
  ...gnoPools.map((pool) => pool.bpt),
  ...gnoPools.map((pool) => pool.id),
] as [string, string, ...string[]])

const zEthToken = z.enum(ethTokens as [string, string, ...string[]])
const zGnoToken = z.enum(gnoTokens as [string, string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: zEthPool.array(),
    tokens: zEthToken.array().optional(),
  }),

  stake: z.object({
    targets: zEthPool.array(),
  }),

  lock: z.object({}),

  // swap: z.object({
  //   sell: zToken.array().optional(),
  //   buy: zToken.array().optional(),
  //   pools: zPool.array().optional(),
  // }),
}

export const gno = {
  deposit: z.object({
    targets: zGnoPool.array(),
    tokens: zGnoToken.array().optional(),
  }),

  stake: z.object({
    targets: zGnoPool.array(),
  }),
}
