import { NotFoundError } from "../../errors"
import pools from "./_info"
import { Pool, StakeToken } from "./types"
import { deposit, stake, lock } from "./actions"
import stakeTokens from "./stakeTokens"

const findPool = (nameOrAddressOrId: string): Pool => {
  const symbolAddressLower = nameOrAddressOrId.toLowerCase()
  const pool = pools.find(
    (pool) =>
      pool.name.toLowerCase() === symbolAddressLower ||
      pool.crvLPToken.toLowerCase() === symbolAddressLower ||
      pool.id.toLowerCase() === symbolAddressLower
  )
  if (!pool) {
    throw new NotFoundError(`Pool not found: ${nameOrAddressOrId}`)
  }
  return pool
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
  deposit: async ({
    targets,
  }: {
    // "targets" is a mandatory parameter
    targets: (Pool["name"] | Pool["crvLPToken"] | Pool["id"])[]
  }) => {
    return targets.flatMap((target) => deposit(findPool(target)))
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
