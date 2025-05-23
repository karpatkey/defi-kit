import ethPools from "./_ethVaults"
import basePools from "./_baseVaults"
import { Address } from "@gnosis-guild/eth-sdk"
import { BigNumberish } from "ethers"

export type EthVault = (typeof ethPools)[number]
export type BaseVault = (typeof basePools)[number]
export type Vault = EthVault | BaseVault

export interface MarketParams {
  loanToken: Address
  collateralToken: Address
  oracle: Address
  irm: Address
  lltv: BigNumberish
}
