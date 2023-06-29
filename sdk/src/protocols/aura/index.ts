import { NotFoundError } from "../../errors"
import pools from "./_info"
import { Pool, StakeTokens, StakeToken } from "./types"
import { deposit, stake } from "./actions"



const findPool = (nameOrAddress: string): Pool => {
  const symbolAddressLower = nameOrAddress.toLowerCase()
  const pool = pools.find(
    (pool) =>
      pool.name.toLowerCase() === symbolAddressLower ||
      pool.bpt.toLowerCase() === symbolAddressLower
  )
  if (!pool) {
    throw new NotFoundError(`Pool not found: ${nameOrAddress}`)
  }
  return pool
}

const findStakeToken = (nameOrAddress: string): StakeToken => {
  const symbolAddressLower = nameOrAddress.toLowerCase()
  const stakeToken = StakeTokens.find(
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
    targets
  }: {
    targets: (Pool["name"] | Pool["bpt"])[]
  }) => {
    return targets.flatMap(
      (target) => deposit(findPool(target))
    )
  },
  stake: ({
    targets
  }: {
    targets: (StakeToken["address"] | StakeToken["symbol"])[]
  }) => {
    return targets.flatMap(
      (target) => stake(findStakeToken(target))
    )
  },
}