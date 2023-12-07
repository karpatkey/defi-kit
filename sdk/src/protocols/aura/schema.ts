import { z } from "zod"
import ethPools from "./_info"
import gnoPools from "./gno/_info"
import ethStakeTokens from "./stakeTokens"
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

const zStakeToken = z.enum([
  ...ethStakeTokens.map((token) => token.address),
  ...ethStakeTokens.map((token) => token.symbol),
] as [string, string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: zEthPool.array(),
    tokens: zEthToken.array().optional(),
  }),

  stake: z.object({
    targets: zStakeToken.array(),
  }),

  // TODO standard action? include in stake action? or move to client-configs?
  // compound: z.object({
  //   targets: zStakeToken.array(),
  // }),

  lock: z.object({}),
}

export const gno = {
  deposit: z.object({
    targets: zGnoPool.array(),
    tokens: zGnoToken.array().optional(),
  }),
}
