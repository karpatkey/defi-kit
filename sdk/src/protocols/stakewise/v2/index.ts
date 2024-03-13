import { NotFoundError } from "../../../errors"
import ethPools from "./_ethPools"
import { EthPool } from "./types"
import { eth as univ3_eth } from "../../uniswap/v3/index"
import { EthToken } from "../../uniswap/v3/types"
import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"

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
    const univ3Permissions = await Promise.all(
      targets.map((target) =>
        univ3_eth.deposit({
          tokens: findPool(ethPools, target)?.tokens.map(token => token.symbol) as EthToken["symbol"][],
          fees: [findPool(ethPools, target)?.fee]
        })
      )
    )
    const permissions = univ3Permissions.flat()
    permissions.push(
      allow.mainnet.stakewise_v2.merkle_distributor.claim(
        undefined,
        c.avatar
      )
    )

    return permissions
  }
}