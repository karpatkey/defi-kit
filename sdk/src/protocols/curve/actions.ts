import { PresetAllowEntry } from "zodiac-roles-sdk"

import * as regular from "./regular"
import { Pool, Token } from "./types"
import { allowZapAdd, allowZapRemove } from "./zap"

const depositOnly = (pool: Pool) => {
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

const withdraw = (pool: Pool) => {
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

export const deposit = (pool: Pool) => [...depositOnly(pool), ...withdraw(pool)]

export const swap = (
  pool: Pool,
  sell: Token[] | undefined,
  buy: Token[] | undefined
) => {
  const result: PresetAllowEntry[] = []
  switch (pool.type) {
    case "regular":
      result.push(...regular.allowSwap(pool, sell, buy))
      break
    default:
      throw new Error(`Not yet implemented: ${pool.type}`)
  }

  return result
}
