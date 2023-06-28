import tokens from "./tokens"

export type Token = (typeof tokens)[number]
export type cToken = (typeof tokens)[number]["cToken"]
