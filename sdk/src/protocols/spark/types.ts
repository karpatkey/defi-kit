import ethTokens from "./_ethInfo"
import gnoTokens from "./_gnoInfo"

export type EthToken = (typeof ethTokens)[number]
export type GnoToken = (typeof gnoTokens)[number]

export type Token = EthToken | GnoToken
