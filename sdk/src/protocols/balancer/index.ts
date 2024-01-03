import { EthPool, EthToken, Pool } from "./types"
import ethPools from "./_info"
import { NotFoundError } from "../../errors"
import { deposit, swap, stake, lock } from "./actions"

export const findPool = (pools: readonly Pool[], nameIdOrBpt: string) => {
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
  sell: EthToken[] | undefined,
  buy: EthToken[] | undefined,
  pools: readonly Pool[]
) => {
  return pools.filter((pool) => {
    const poolTokens = pool.tokens.map(
      (token) => token.address
    ) as readonly string[]
    if (sell && sell.length > 0) {
      const hasSell = sell.some((token) => poolTokens.includes(token.address))
      if (!hasSell) {
        return false
      }
    }
    if (buy && buy.length > 0) {
      const hasBuy = buy.some((token) => poolTokens.includes(token.address))
      if (!hasBuy) {
        return false
      }
    }
    return true
  })
}

const findToken = (symbolOrAddress: string): EthToken => {
  const symbolAddressLower = symbolOrAddress.toLowerCase()
  const tokens = ethPools.flatMap((pool) => [...pool.tokens])
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

export const eth = {
  deposit: async (options: {
    targets: (EthPool["name"] | EthPool["bpt"] | EthPool["id"])[]
    tokens?: (EthToken["address"] | EthToken["symbol"])[]
  }) =>
    options.targets.flatMap((target) =>
      deposit(findPool(ethPools, target), options.tokens?.map(findToken))
    ),

  stake: async (options: {
    targets: (EthPool["name"] | EthPool["bpt"] | EthPool["id"])[]
  }) => options.targets.flatMap((target) => stake(findPool(ethPools, target))),

  lock: async () => {
    return lock()
  },

  swap: async (options: {
    sell?: (EthToken["address"] | EthToken["symbol"])[]
    buy?: (EthToken["address"] | EthToken["symbol"])[]
    pools?: (EthPool["name"] | EthPool["bpt"] | EthPool["id"])[]
  }) =>
    filterPoolsByTokens(
      options.sell?.map(findToken),
      options.buy?.map(findToken),
      options.pools
        ? options.pools.map((addressOrName) =>
            findPool(ethPools, addressOrName)
          )
        : ethPools
    ).flatMap((pool) =>
      swap(pool, options.sell?.map(findToken), options.buy?.map(findToken))
    ),
}
