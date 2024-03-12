import { NotFoundError } from "../../errors"
import ethPools from "./_ethPools"
import gnoPools from "./_gnoPools"
import { EthPool, StakeToken, EthToken, GnoToken, GnoPool, Pool } from "./types"
import { Chain } from "../../types"
import { deposit, stake, lock } from "./actions"
import stakeTokens from "./stakeTokens"

const findPool = (pools: readonly Pool[], nameOrAddressOrId: string) => {
  const nameOrAddressOrIdLower = nameOrAddressOrId.toLowerCase()
  const pool = pools.find(
    (pool) =>
      pool.name.toLowerCase() === nameOrAddressOrIdLower ||
      pool.bpt.toLowerCase() === nameOrAddressOrIdLower ||
      pool.id.toLowerCase() === nameOrAddressOrIdLower
  )
  if (!pool) {
    throw new NotFoundError(`Pool not found: ${nameOrAddressOrId}`)
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

  // Included in stake() action
  // compound: async({
  //   targets,
  // }: {
  //   targets: (StakeToken["address"] | StakeToken["symbol"])[]
  // }) => {
  //   return targets.flatMap((target) => compound(findStakeToken(target)))
  // },

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
