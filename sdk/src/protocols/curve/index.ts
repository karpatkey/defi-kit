import { EthPool, EthToken, Pool } from "./types"
import ethPools from "./pools/eth"
import { NotFoundError } from "../../errors"
import { deposit, swap } from "./actions"

export const eth = {
  deposit: (options: { target: EthPool["name"] | EthPool["address"] }) =>
    deposit(findPool(ethPools, options.target)),

  swap: (options: {
    sell?: EthToken[]
    buy?: EthToken[]
    pools?: (EthPool["name"] | EthPool["address"])[]
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

const findPool = (pools: readonly Pool[], nameOrAddress: string) => {
  const nameOrAddressLower = nameOrAddress.toLowerCase()
  const pool = pools.find(
    (pool) =>
      pool.name.toLowerCase() === nameOrAddressLower ||
      pool.address.toLowerCase() === nameOrAddressLower
  )
  if (!pool) {
    throw new NotFoundError(`Pool not found: ${nameOrAddress}`)
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
