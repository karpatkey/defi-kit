import ethPools from "./_ethPools"
import gnoPools from "./_gnoPools"

export type EthPool = (typeof ethPools)[number]
export type GnoPool = (typeof gnoPools)[number]
export type Pool = EthPool | GnoPool

export type EthToken = (typeof ethPools)[number]["tokens"][number]
export type GnoToken = (typeof gnoPools)[number]["tokens"][number]
export type Token = EthToken | GnoToken
