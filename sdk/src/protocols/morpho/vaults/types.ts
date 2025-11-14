import ethVaults from "./_ethInfo"
import arb1Vaults from "./_arb1Info"
import baseVaults from "./_baseInfo"

export type EthVault = (typeof ethVaults)[number]
export type Arb1Vault = (typeof arb1Vaults)[number]
export type BaseVault = (typeof baseVaults)[number]
export type Vault = EthVault | Arb1Vault | BaseVault
