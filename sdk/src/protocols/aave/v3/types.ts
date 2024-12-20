import ethTokens from "./_ethCoreInfo"
import gnoTokens from "./_gnoCoreInfo"
import arb1Tokens from "./_arb1CoreInfo"
import oethTokens from "./_oethCoreInfo"
import baseTokens from "./_baseCoreInfo"

export type EthToken = (typeof ethTokens)[number]
export type GnoToken = (typeof gnoTokens)[number]
export type Arb1Token = (typeof arb1Tokens)[number]
export type OethToken = (typeof oethTokens)[number]
export type BaseToken = (typeof baseTokens)[number]

export type Token = EthToken | GnoToken | Arb1Token | OethToken | BaseToken
