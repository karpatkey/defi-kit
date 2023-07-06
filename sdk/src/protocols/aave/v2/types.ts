import tokens from "./_info"
import delegateTokens from "./delegateTokens"

export type Token = (typeof tokens)[number]
export type DelegateToken = (typeof delegateTokens)[number]
