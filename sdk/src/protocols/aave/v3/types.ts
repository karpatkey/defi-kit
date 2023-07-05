import tokens from "./_info"
import delegateTokens from "../v2/delegateTokens"

export type Token = (typeof tokens)[number]
export type DelegateToken = (typeof delegateTokens)[number]
