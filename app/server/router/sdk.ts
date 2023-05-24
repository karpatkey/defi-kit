import * as mainnetSdk from "defi-presets/mainnet"

export const sdks = {
  eth: mainnetSdk,
  // gor: 5,
  // bnb: 56,
  // gno: 100,
  // matic: 137,
  // arb1: 42161,
} as const

export type ChainPrefix = keyof typeof sdks
