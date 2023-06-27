import { EthPool, EthToken, Pool } from "./types"
import ethPools from "./_info"
import { NotFoundError } from "../../errors"
import { deposit, swap } from "./actions"

export const eth = {
  deposit: (options: {
    targets: (EthPool["name"] | EthPool["bpt"] | EthPool["id"])[],
    tokens?: (EthPool["name"] | EthPool["bpt"] | EthPool["id"])[],

  }) =>
    options.targets.flatMap((target) => deposit(findPool(ethPools, target)), tokens),

  swap: (options: {
    sell?: EthToken[]
    buy?: EthToken[]
    pools?: (EthPool["name"] | EthPool["bpt"] | EthPool["id"])[]
  }) =>
    filterPoolsByTokens(
      options.sell,
      options.buy,
      options.pools
        ? options.pools.map((addressOrName) =>
            findPool(ethPools, addressOrName)
          )
        : ethPools
    ).flatMap((pool) => swap(pool, options.sell, options.buy)),
}

const findPool = (pools: readonly Pool[], nameIdOrBpt: string) => {
  const nameIdOrBptLower = nameIdOrBpt.toLowerCase()
  const pool = pools.find(
    (pool) =>
      pool.name.toLowerCase() === nameIdOrBptLower ||
      pool.id.toLowerCase() === nameIdOrBptLower ||
      pool.bpt.toLowerCase() === nameIdOrBptLower
  )
  if (!pool) {
    throw new NotFoundError(`Pool not found: ${nameIdOrBpt}`)
  }
  return pool
}

const filterPoolsByTokens = (
  sell: string[] | undefined,
  buy: string[] | undefined,
  pools: readonly Pool[]
) => {
  return pools.filter((pool) => {
    const poolTokens = pool.tokens as readonly string[]
    if (sell && sell.length > 0) {
      const hasSell = sell.some((token) => poolTokens.includes(token))
      if (!hasSell) {
        return false
      }
    }
    if (buy && buy.length > 0) {
      const hasBuy = buy.some((token) => poolTokens.includes(token))
      if (!hasBuy) {
        return false
      }
    }
    return true
  })
}
