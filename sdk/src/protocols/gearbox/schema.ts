import { z } from "zod"
import ethVaults from "./_ethInfo"

// Extract vault IDs for each chain
const ethVaultTargets = ethVaults.flatMap((vault) => [vault.id])

// Create Zod schemas for vaults (IDs)
const zEthVault = z.enum(ethVaultTargets as [string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: zEthVault.array(),
  }),
}
