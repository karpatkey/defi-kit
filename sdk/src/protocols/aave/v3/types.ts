import ethCoreTokens from "./_ethCoreInfo"
import ethPrimeTokens from "./_ethPrimeInfo"
import ethEtherFiTokens from "./_ethEtherFiInfo"
import ethMarkets from "./_ethMarketInfo"
import gnoTokens from "./_gnoCoreInfo"
import arb1Tokens from "./_arb1CoreInfo"
import oethTokens from "./_oethCoreInfo"
import baseTokens from "./_baseCoreInfo"

export type EthCoreToken = (typeof ethCoreTokens)[number]
export type EthPrimeToken = (typeof ethPrimeTokens)[number]
export type EthEtherFiToken = (typeof ethEtherFiTokens)[number]

export type EthToken = EthCoreToken | EthPrimeToken | EthEtherFiToken

export type GnoToken = (typeof gnoTokens)[number]
export type Arb1Token = (typeof arb1Tokens)[number]
export type OethToken = (typeof oethTokens)[number]
export type BaseToken = (typeof baseTokens)[number]

export type Token = EthToken | GnoToken | Arb1Token | OethToken | BaseToken

export type EthMarket = (typeof ethMarkets)[number]
