import { MainnetPool } from "./types"
import mainnetPools from "./pools/mainnet"
import { NotFoundError } from "../../errors"
import { deposit, swap } from "./actions"

export const mainnet = {
  deposit: (nameOrAddress: MainnetPool["name"] | MainnetPool["address"]) =>
    deposit(findMainnetPool(nameOrAddress)),
  swap: (nameOrAddress: MainnetPool["name"] | MainnetPool["address"]) =>
    swap(findMainnetPool(nameOrAddress)),
}

const findMainnetPool = (nameOrAddress: string) => {
  const nameOrAddressLower = nameOrAddress.toLowerCase()
  const pool = mainnetPools.find(
    (pool) =>
      pool.name.toLowerCase() === nameOrAddressLower ||
      pool.address.toLowerCase() === nameOrAddressLower
  )
  if (!pool) {
    throw new NotFoundError(`Pool not found: ${nameOrAddress}`)
  }
  return pool
}
