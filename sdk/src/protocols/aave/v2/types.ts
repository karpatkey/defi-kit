import tokens from "./_ethCoreInfo"
import delegateTokens from "../v3/_delegateTokens"
import stakeTokens from "../v3/_stakeTokens"

export type Token = (typeof tokens)[number]
export type DelegateToken = (typeof delegateTokens)[number]
export type StakeToken = (typeof stakeTokens)[number]
