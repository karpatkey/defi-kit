import { EthPool } from "./types"
import ethPools from "./pools/eth"
import { NotFoundError } from "../../errors"
import { deposit, swap } from "./actions"

export const eth = {
  deposit: (nameOrAddress: EthPool["name"] | EthPool["address"]) =>
    deposit(findEthPool(nameOrAddress)),
  swap: (nameOrAddress: EthPool["name"] | EthPool["address"]) =>
    swap(findEthPool(nameOrAddress)),
}

const findEthPool = (nameOrAddress: string) => {
  const nameOrAddressLower = nameOrAddress.toLowerCase()
  const pool = ethPools.find(
    (pool) =>
      pool.name.toLowerCase() === nameOrAddressLower ||
      pool.address.toLowerCase() === nameOrAddressLower
  )
  if (!pool) {
    throw new NotFoundError(`Pool not found: ${nameOrAddress}`)
  }
  return pool
}
