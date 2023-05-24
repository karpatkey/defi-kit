import * as eth from "defi-presets/eth"

export const sdks = {
  eth,
  // gor: 5,
  // bnb: 56,
  // gno: 100,
  // matic: 137,
  // arb1: 42161,
} as const

export type ChainPrefix = keyof typeof sdks
