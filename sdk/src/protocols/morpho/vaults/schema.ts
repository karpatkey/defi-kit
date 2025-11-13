import { z } from "zod"
import ethVaults from "./_ethInfo"
import arb1Vaults from "./_arb1Info"
import baseVaults from "./_baseInfo"

// Extract vault IDs, names, and symbols for each chain
const ethVaultTargets = ethVaults.flatMap((vault) => [
  vault.id,
  vault.name,
  vault.symbol,
])
const arb1VaultTargets = arb1Vaults.flatMap((vault) => [
  vault.id,
  vault.name,
  vault.symbol,
])
const baseVaultTargets = baseVaults.flatMap((vault) => [
  vault.id,
  vault.name,
  vault.symbol,
])

// Create Zod schemas for vaults (IDs, names, and symbols)
const zEthVault = z.enum(ethVaultTargets as [string, ...string[]])
const zArb1Vault = z.enum(arb1VaultTargets as [string, ...string[]])
const zBaseVault = z.enum(baseVaultTargets as [string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: zEthVault.array(),
  }),
}

export const arb1 = {
  deposit: z.object({
    targets: zArb1Vault.array(),
  }),
}

export const base = {
  deposit: z.object({
    targets: zBaseVault.array(),
  }),
}
