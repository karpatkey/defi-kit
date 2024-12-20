import {
  EthPool,
  EthToken,
  StakeToken,
  GnoToken,
  GnoPool,
  Arb1Pool,
  Arb1Token,
  OethPool,
  OethToken,
  BasePool,
  BaseToken,
  Pool,
} from "./types"
import ethPools from "./_ethPools"
import stakeTokens from "./stakeTokens"
import gnoPools from "./_gnoPools"
import arb1Pools from "./_arb1Pools"
import oethPools from "./_oethPools"
import basePools from "./_basePools"
import { NotFoundError } from "../../errors"
import { deposit, stake, lock } from "./actions"
import { Chain } from "../../types"

export const findPool = (
  pools: readonly Pool[],
  nameOrAddressOrIdOrRewarder: string
) => {
  const nameOrAddressOrIdOrRewarderLower =
    nameOrAddressOrIdOrRewarder.toLowerCase()
  const pool = pools.find(
    (pool) =>
      pool.name.toLowerCase() === nameOrAddressOrIdOrRewarderLower ||
      pool.bpt.toLowerCase() === nameOrAddressOrIdOrRewarderLower ||
      pool.id.toLowerCase() === nameOrAddressOrIdOrRewarderLower ||
      pool.rewarder.toLowerCase() === nameOrAddressOrIdOrRewarderLower
  )
  if (!pool) {
    throw new NotFoundError(`Pool not found`)
  }
  return pool
}

const findToken = (pools: readonly Pool[], symbolOrAddress: string) => {
  const symbolOrAddressLower = symbolOrAddress.toLowerCase()
  const tokens = pools.flatMap((pool) => [...pool.tokens])
  const token = tokens.find(
    (token) =>
      token.symbol.toLowerCase() === symbolOrAddressLower ||
      token.address.toLowerCase() === symbolOrAddressLower
  )
  if (!token) {
    throw new NotFoundError(`Token not found: ${symbolOrAddress}`)
  }
  return token
}

const findStakeToken = (nameOrAddress: string): StakeToken => {
  const nameOrAddressOrIdLower = nameOrAddress.toLowerCase()
  const stakeToken = stakeTokens.find(
    (stakeToken) =>
      stakeToken.address.toLowerCase() === nameOrAddressOrIdLower ||
      stakeToken.symbol.toLowerCase() === nameOrAddressOrIdLower
  )
  if (!stakeToken) {
    throw new NotFoundError(`Token not found on eth: ${nameOrAddress}`)
  }
  return stakeToken
}

export const eth = {
  deposit: async ({
    targets,
    tokens,
  }: {
    // "targets" is a mandatory parameter
    targets: (EthPool["name"] | EthPool["bpt"] | EthPool["id"])[]
    // "tokens" is an optional parameter since the user might want to allow (or not) the depositSingle() function
    // If "tokens" is not specified then we allow all the pool.tokens[]
    tokens?: (EthToken["address"] | EthToken["symbol"])[]
  }) => {
    return targets.flatMap((target) =>
      deposit(
        Chain.eth,
        findPool(ethPools, target),
        tokens?.map((addressOrSymbol) => findToken(ethPools, addressOrSymbol))
      )
    )
  },

  stake: async ({
    targets,
  }: {
    targets: (StakeToken["address"] | StakeToken["symbol"])[]
  }) => {
    return targets.flatMap((token) => stake(findStakeToken(token)))
  },

  lock: async () => {
    return lock()
  },
}

export const gno = {
  deposit: async ({
    targets,
    tokens,
  }: {
    // "targets" is a mandatory parameter
    targets: (GnoPool["name"] | GnoPool["bpt"] | GnoPool["id"])[]
    // "tokens" is an optional parameter since the user might want to allow (or not) the depositSingle() function
    // If "tokens" is not specified then we allow all the pool.tokens[]
    tokens?: (GnoToken["address"] | GnoToken["symbol"])[]
  }) => {
    return targets.flatMap((target) =>
      deposit(
        Chain.gno,
        findPool(gnoPools, target),
        tokens?.map((addressOrSymbol) => findToken(gnoPools, addressOrSymbol))
      )
    )
  },
}

export const arb1 = {
  deposit: async ({
    targets,
    tokens,
  }: {
    // "targets" is a mandatory parameter
    targets: (Arb1Pool["name"] | Arb1Pool["bpt"] | Arb1Pool["id"])[]
    // "tokens" is an optional parameter since the user might want to allow (or not) the depositSingle() function
    // If "tokens" is not specified then we allow all the pool.tokens[]
    tokens?: (Arb1Token["address"] | Arb1Token["symbol"])[]
  }) => {
    return targets.flatMap((target) =>
      deposit(
        Chain.arb1,
        findPool(arb1Pools, target),
        tokens?.map((addressOrSymbol) => findToken(arb1Pools, addressOrSymbol))
      )
    )
  },
}

export const oeth = {
  deposit: async ({
    targets,
    tokens,
  }: {
    // "targets" is a mandatory parameter
    targets: (OethPool["name"] | OethPool["bpt"] | OethPool["id"])[]
    // "tokens" is an optional parameter since the user might want to allow (or not) the depositSingle() function
    // If "tokens" is not specified then we allow all the pool.tokens[]
    tokens?: (OethToken["address"] | OethToken["symbol"])[]
  }) => {
    return targets.flatMap((target) =>
      deposit(
        Chain.oeth,
        findPool(oethPools, target),
        tokens?.map((addressOrSymbol) => findToken(oethPools, addressOrSymbol))
      )
    )
  },
}

export const base = {
  deposit: async ({
    targets,
    tokens,
  }: {
    // "targets" is a mandatory parameter
    targets: (BasePool["name"] | BasePool["bpt"] | BasePool["id"])[]
    // "tokens" is an optional parameter since the user might want to allow (or not) the depositSingle() function
    // If "tokens" is not specified then we allow all the pool.tokens[]
    tokens?: (BaseToken["address"] | BaseToken["symbol"])[]
  }) => {
    return targets.flatMap((target) =>
      deposit(
        Chain.base,
        findPool(basePools, target),
        tokens?.map((addressOrSymbol) => findToken(basePools, addressOrSymbol))
      )
    )
  },
}
