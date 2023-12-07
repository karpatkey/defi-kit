import tokens from "./_info"

export type Token = (typeof tokens)[number]
export type cToken = (typeof tokens)[number]["cToken"]
