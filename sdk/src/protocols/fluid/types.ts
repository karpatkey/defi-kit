import arb1Tokens from "./_arb1Info"
import baseTokens from "./_baseInfo"
import ethTokens from "./_ethInfo"

export type Arb1Token = (typeof arb1Tokens)[number]
export type BaseToken = (typeof baseTokens)[number]
export type EthToken = (typeof ethTokens)[number]

export type Token = Arb1Token | BaseToken | EthToken
