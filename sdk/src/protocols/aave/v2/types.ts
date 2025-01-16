import tokens from "./_ethCoreInfo"
import delegateTokens from "./_delegateTokens"
import stakeTokens from "./_stakeTokens"

export type Token = (typeof tokens)[number]
export type DelegateToken = (typeof delegateTokens)[number]
export type StakeToken = (typeof stakeTokens)[number]
