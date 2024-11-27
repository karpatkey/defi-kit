import ethVaults from "./_ethVaults"
import gnoVaults from "./_gnoVaults"

export type EthVault = Omit<(typeof ethVaults)[number], "description">
export type GnoVault = Omit<(typeof gnoVaults)[number], "description">
export type Vault = EthVault | GnoVault
