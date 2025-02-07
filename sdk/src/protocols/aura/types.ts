import ethPools from "./_ethPools"
import gnoPools from "./_gnoPools"
import arb1Pools from "./_arb1Pools"
import oethPools from "./_oethPools"
import basePools from "./_basePools"
import stakeTokens from "./_stakeTokens"

export type EthPool = (typeof ethPools)[number]
export type GnoPool = (typeof gnoPools)[number]
export type Arb1Pool = (typeof arb1Pools)[number]
export type OethPool = (typeof oethPools)[number]
export type BasePool = (typeof basePools)[number]
export type Pool = EthPool | GnoPool | Arb1Pool | OethPool | BasePool

export type EthToken = (typeof ethPools)[number]["tokens"][number]
export type GnoToken = (typeof gnoPools)[number]["tokens"][number]
export type Arb1Token = (typeof arb1Pools)[number]["tokens"][number]
export type OethToken = (typeof oethPools)[number]["tokens"][number]
export type BaseToken = (typeof basePools)[number]["tokens"][number]
export type Token = EthToken | GnoToken | Arb1Token | OethToken | BaseToken

export type StakeToken = (typeof stakeTokens)[number]
