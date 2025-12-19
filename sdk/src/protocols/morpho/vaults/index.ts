import { NotFoundError } from "../../../errors"
import ethVaults from "./_ethInfo"
import arb1Vaults from "./_arb1Info"
import baseVaults from "./_baseInfo"
import { EthVault, Arb1Vault, BaseVault, Vault } from "./types"
import { deposit } from "./actions"

export const findVault = (vaults: readonly Vault[], target: string): Vault => {
  const vault = vaults.find(
    (vault) =>
      vault.id.toLowerCase() === target.toLowerCase() ||
      vault.name.toLowerCase() === target.toLowerCase() ||
      vault.symbol.toLowerCase() === target.toLowerCase()
  )
  if (!vault) {
    throw new NotFoundError(`Vault not found: ${target}`)
  }
  return vault
}

export const eth = {
  deposit: async ({
    targets,
  }: {
    targets: (EthVault["id"] | EthVault["name"] | EthVault["symbol"])[]
  }) => {
    return targets.flatMap((target) => deposit(findVault(ethVaults, target)))
  },
}

export const arb1 = {
  deposit: async ({
    targets,
  }: {
    targets: (Arb1Vault["id"] | Arb1Vault["name"] | Arb1Vault["symbol"])[]
  }) => {
    return targets.flatMap((target) => deposit(findVault(arb1Vaults, target)))
  },
}

export const base = {
  deposit: async ({
    targets,
  }: {
    targets: (BaseVault["id"] | BaseVault["name"] | BaseVault["symbol"])[]
  }) => {
    return targets.flatMap((target) => deposit(findVault(baseVaults, target)))
  },
}
