import ethTokens from "./_ethInfo"
import gnoTokens from "./_gnoInfo"
import arb1Tokens from "./_arb1Info"
import oethTokens from "./_oethInfo"
import baseTokens from "./_baseInfo"

export type EthToken = (typeof ethTokens)[number]
export type GnoToken = (typeof gnoTokens)[number]
export type Arb1Token = (typeof arb1Tokens)[number]
export type OethToken = (typeof oethTokens)[number]
export type BaseToken = (typeof baseTokens)[number]

export type Token = EthToken | GnoToken | Arb1Token | OethToken | BaseToken
