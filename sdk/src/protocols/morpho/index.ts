import { MarketParams, Vault } from "./types"
import { NotFoundError } from "../../errors"
import _ethPools from "./_ethVaults"
import _basePools from "./_baseVaults"
import { Chain } from "../../types"
import {
  deposit,
  manageCollateral,
  manageLoan,
  manageSupply,
  withdraw,
} from "./actions"

const findVault = (chain: Chain, nameOrAddress: string): Vault => {
  let pools
  switch (chain) {
    case Chain.eth:
      pools = _ethPools
      break
    case Chain.base:
      pools = _basePools
      break
    default:
      throw new Error(`Unsupported chain: ${chain}`)
  }
  const nameOrAddressLower = nameOrAddress.toLowerCase()
  const pool = pools.find(
    (pool) =>
      pool.name.toLowerCase() === nameOrAddressLower ||
      pool.address.toLowerCase() === nameOrAddressLower ||
      pool.symbol.toLowerCase() === nameOrAddressLower
  )
  if (!pool) {
    throw new NotFoundError(`Pool not found: ${nameOrAddress}`)
  }
  return pool
}

export const eth = {
  deposit: async ({
    targets,
  }: {
    targets: (Vault["symbol"] | Vault["address"])[]
  }) => {
    return targets.flatMap((target) => {
      const vault = findVault(Chain.eth, target)
      return [...deposit(vault), ...withdraw(vault)]
    })
  },
  borrow: async ({ targets }: { targets: MarketParams[] }) => {
    return targets.flatMap(async (marketParams) => {
      return [...manageCollateral(marketParams), ...manageLoan(marketParams)]
    })
  },
  supply: async ({ targets }: { targets: MarketParams[] }) => {
    return targets.flatMap(async (marketParams) => {
      return manageSupply(marketParams)
    })
  },
}
