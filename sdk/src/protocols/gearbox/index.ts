import { NotFoundError } from "../../errors"
import ethVaults from "./_ethInfo"
import { EthVault } from "./types"
import { deposit } from "./actions"

export const findVault = (
  vaults: readonly EthVault[],
  target: string
): EthVault => {
  const vault = vaults.find(
    (vault) => vault.id.toLowerCase() === target.toLowerCase()
  )
  if (!vault) {
    throw new NotFoundError(`Vault not found: ${target}`)
  }
  return vault
}

export const eth = {
  deposit: async ({ targets }: { targets: EthVault["id"][] }) => {
    return targets.flatMap((target) => deposit(findVault(ethVaults, target)))
  },
}
