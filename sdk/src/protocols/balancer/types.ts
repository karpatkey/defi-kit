import pools from "./_info"

export type EthPool = (typeof pools)[number]
export type EthToken = EthPool["tokens"][number]

export type Pool = EthPool
export type Token = EthToken
