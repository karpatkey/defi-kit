import { NotFoundError } from "../../errors"
import pools from "./_info"
import { Pool, StakeToken, Token } from "./types"
import { deposit, stake, compound, lock } from "./actions"
import stakeTokens from "./stakeTokens"

const findPool = (nameOrAddressOrId: string): Pool => {
  const symbolAddressLower = nameOrAddressOrId.toLowerCase()
  const pool = pools.find(
    (pool) =>
      pool.name.toLowerCase() === symbolAddressLower ||
      pool.bpt.toLowerCase() === symbolAddressLower ||
      pool.id.toLowerCase() === symbolAddressLower
  )
  if (!pool) {
    throw new NotFoundError(`Pool not found: ${nameOrAddressOrId}`)
  }
  return pool
}

const findToken = (symbolOrAddress: string): Token => {
  const symbolAddressLower = symbolOrAddress.toLowerCase()
  const tokens = pools.flatMap((pool) => [...pool.tokens])
  const token = tokens.find(
    (token) =>
      token.symbol.toLowerCase() === symbolAddressLower ||
      token.address.toLowerCase() === symbolAddressLower
  )
  if (!token) {
    throw new NotFoundError(`Token not found: ${symbolOrAddress}`)
  }
  return token
}

const findStakeToken = (nameOrAddress: string): StakeToken => {
  const symbolAddressLower = nameOrAddress.toLowerCase()
  const stakeToken = stakeTokens.find(
    (stakeToken) =>
      stakeToken.address.toLowerCase() === symbolAddressLower ||
      stakeToken.symbol.toLowerCase() === symbolAddressLower
  )
  if (!stakeToken) {
    throw new NotFoundError(`Token not found: ${nameOrAddress}`)
  }
  return stakeToken
}

export const eth = {
  deposit: ({
    targets,
    tokens,
  }: {
    // "targets" is a mandatory parameter
    targets: (Pool["name"] | Pool["bpt"] | Pool["id"])[]
    // "tokens" is an optional parameter since the user might want to allow (or not) the depositSingle() function
    // If "tokens" is not specified then we allow all the pool.tokens[]
    tokens?: (Token["address"] | Token["symbol"])[]
  }) => {
    return targets.flatMap((target) =>
      deposit(findPool(target), tokens?.map(findToken))
    )
  },

  stake: ({
    targets,
  }: {
    targets: (StakeToken["address"] | StakeToken["symbol"])[]
  }) => {
    return targets.flatMap((token) => stake(findStakeToken(token)))
  },

  // TODO standard action? include in stake action? or move to client-configs?
  // compound: ({
  //   targets,
  // }: {
  //   targets: (StakeToken["address"] | StakeToken["symbol"])[]
  // }) => {
  //   return targets.flatMap((target) => compound(findStakeToken(target)))
  // },

  // TODO introduce new standard action or client-configs?
  // lock: () => {
  //   return lock()
  // },
}
