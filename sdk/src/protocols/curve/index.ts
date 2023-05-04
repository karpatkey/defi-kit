import { PresetAllowEntry } from "zodiac-roles-sdk"

import pools from "./pools"
import * as regular from "./regular"
import { Pool } from "./types"
import { allowZapAdd, allowZapRemove } from "./zap"

export const deposit = (nameOrAddress: Pool["name"] | Pool["address"]) => {
  const pool = findPool(nameOrAddress)

  const result: PresetAllowEntry[] = []
  switch (pool.type) {
    case "regular":
      result.push(...regular.allowDeposit(pool))
      break
    default:
      throw new Error(`Not yet implemented: ${pool.type}`)
  }

  if ("zap" in pool) {
    result.push(...allowZapAdd(pool))
  }

  return result
}

export const withdraw = (nameOrAddress: Pool["name"] | Pool["address"]) => {
  const pool = findPool(nameOrAddress)

  const result: PresetAllowEntry[] = []
  switch (pool.type) {
    case "regular":
      result.push(...regular.allowWithdraw(pool))
      break
    default:
      throw new Error(`Not yet implemented: ${pool.type}`)
  }

  if ("zap" in pool) {
    result.push(...allowZapRemove(pool))
  }

  return result
}

export const swap = (nameOrAddress: Pool["name"] | Pool["address"]) => {
  const pool = findPool(nameOrAddress)

  const result: PresetAllowEntry[] = []
  switch (pool.type) {
    case "regular":
      result.push(...regular.allowSwap(pool))
      break
    default:
      throw new Error(`Not yet implemented: ${pool.type}`)
  }

  return result
}

const findPool = (nameOrAddress: Pool["name"] | Pool["address"]) => {
  const nameOrAddressLower = nameOrAddress.toLowerCase()
  const pool = pools.find(
    (pool) =>
      pool.name.toLowerCase() === nameOrAddressLower ||
      pool.address.toLowerCase() === nameOrAddressLower
  )
  if (!pool) {
    throw new Error(`Pool not found: ${nameOrAddress}`)
  }
  return pool
}
