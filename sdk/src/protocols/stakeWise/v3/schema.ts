import { z } from "zod"
import ethVaults from "./_ethVaults"
import gnoVaults from "./_gnoVaults"

const zEthVault = z.enum([
  ...ethVaults.map((vault) => vault.id),
  ...ethVaults.map((vault) => vault.name),
] as [string, string, ...string[]])

const zGnoVault = z.enum([
  ...gnoVaults.map((vault) => vault.id),
  ...gnoVaults.map((vault) => vault.name),
] as [string, string, ...string[]])

export const eth = {
  stake: z.object({
    targets: zEthVault.array(),
  }),
}

export const gno = {
  stake: z.object({
    targets: zGnoVault.array(),
  }),
}
