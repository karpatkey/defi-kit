import { z } from "zod"
import ethPools from "./_ethPools"
import ethStakeTokens from "./stakeTokens"
import gnoPools from "./_gnoPools"
import arb1Pools from "./_arb1Pools"
import oethPools from "./_oethPools"
import basePools from "./_basePools"
import { EthToken, GnoToken, Arb1Token, OethToken, BaseToken } from "./types"

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
const arb1Tokens = [
  ...new Set(
    arb1Pools
      .flatMap((pool) => pool.tokens as readonly Arb1Token[])
      .flatMap((token) => [token.address, token.symbol])
  ),
]
const oethTokens = [
  ...new Set(
    oethPools
      .flatMap((pool) => pool.tokens as readonly OethToken[])
      .flatMap((token) => [token.address, token.symbol])
  ),
]
const baseTokens = [
  ...new Set(
    basePools
      .flatMap((pool) => pool.tokens as readonly BaseToken[])
      .flatMap((token) => [token.address, token.symbol])
  ),
]

export const zEthPool = z.enum([
  ...ethPools.map((pool) => pool.name),
  ...ethPools.map((pool) => pool.bpt),
  ...ethPools.map((pool) => pool.id),
] as [string, string, ...string[]])
export const zGnoPool = z.enum([
  ...gnoPools.map((pool) => pool.name),
  ...gnoPools.map((pool) => pool.bpt),
  ...gnoPools.map((pool) => pool.id),
] as [string, string, ...string[]])
const zArb1Pool = z.enum([
  ...arb1Pools.map((pool) => pool.name),
  ...arb1Pools.map((pool) => pool.bpt),
  ...arb1Pools.map((pool) => pool.id),
] as [string, string, ...string[]])
const zOethPool = z.enum([
  ...oethPools.map((pool) => pool.name),
  ...oethPools.map((pool) => pool.bpt),
  ...oethPools.map((pool) => pool.id),
] as [string, string, ...string[]])
const zBasePool = z.enum([
  ...basePools.map((pool) => pool.name),
  ...basePools.map((pool) => pool.bpt),
  ...basePools.map((pool) => pool.id),
] as [string, string, ...string[]])

const zEthToken = z.enum(ethTokens as [string, string, ...string[]])
const zGnoToken = z.enum(gnoTokens as [string, string, ...string[]])
const zArb1Token = z.enum(arb1Tokens as [string, string, ...string[]])
const zOethToken = z.enum(oethTokens as [string, string, ...string[]])
const zBaseToken = z.enum(baseTokens as [string, string, ...string[]])

const zStakeToken = z.enum([
  ...ethStakeTokens.map((token) => token.symbol),
  ...ethStakeTokens.map((token) => token.address),
] as [string, string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: zEthPool.array(),
    tokens: zEthToken.array().optional(),
  }),

  stake: z.object({
    targets: zStakeToken.array(),
  }),

  lock: z.object({}),
}

export const gno = {
  deposit: z.object({
    targets: zGnoPool.array(),
    tokens: zGnoToken.array().optional(),
  }),
}

export const arb1 = {
  deposit: z.object({
    targets: zArb1Pool.array(),
    tokens: zArb1Token.array().optional(),
  }),
}

export const oeth = {
  deposit: z.object({
    targets: zOethPool.array(),
    tokens: zOethToken.array().optional(),
  }),
}

export const base = {
  deposit: z.object({
    targets: zBasePool.array(),
    tokens: zBaseToken.array().optional(),
  }),
}