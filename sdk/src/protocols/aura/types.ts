import ethPools from "./_ethPools"
import gnoPools from "./_gnoPools"
import stakeTokens from "./stakeTokens"

export type EthPool = (typeof ethPools)[number]
export type GnoPool = (typeof gnoPools)[number]
export type Pool = EthPool | GnoPool

export type EthToken = (typeof ethPools)[number]["tokens"][number]
export type GnoToken = (typeof gnoPools)[number]["tokens"][number]
export type Token = EthToken | GnoToken

export type StakeToken = (typeof stakeTokens)[number]
