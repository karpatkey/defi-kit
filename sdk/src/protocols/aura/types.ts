import pools from "./_info"
import stakeTokens from "./stakeTokens"

export type Pool = (typeof pools)[number]
export type Token = (typeof pools)[number]['tokens'][number]

export type StakeToken = (typeof stakeTokens)[number]