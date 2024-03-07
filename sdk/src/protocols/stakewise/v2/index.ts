import { NotFoundError } from "../../../errors"
import ethPools from "./_ethPools"
import { EthPool } from "./types"
import { eth as univ3_eth } from "../../uniswap_v3/index"
import { EthToken } from "../../uniswap_v3/types"

const findPool = (pools: readonly EthPool[], nameOrAddress: string) => {
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

export const eth = {
  deposit: async ({
    targets
  }: {
    targets: (EthPool["name"] | EthPool["address"])[]
  }) => {
    return targets.flatMap((target) =>
      univ3_eth.deposit({
        tokens: findPool(ethPools, target)?.tokens.map(token => token.symbol) as EthToken["symbol"][],
        fees: [findPool(ethPools, target)?.fee]
      })
    )
  }
}