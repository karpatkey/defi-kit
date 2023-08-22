import pools from "./_info"
import stakeTokens from "./stakeTokens"

export type Pool = (typeof pools)[number]

export type StakeToken = (typeof stakeTokens)[number]
