import tokens from "./_info"
import delegateTokens from "./delegateTokens"
import stakeTokens from "./stakeTokens"

export type Token = (typeof tokens)[number]
export type DelegateToken = (typeof delegateTokens)[number]
export type StakeToken = (typeof stakeTokens)[number]
