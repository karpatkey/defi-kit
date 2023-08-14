import * as eth from "defi-kit/eth"
import * as gor from "defi-kit/gor"

export const sdks = {
  eth,
  gor,
  // bnb: 56,
  // gno: 100,
  // matic: 137,
  // arb1: 42161,
} as const

export type ChainPrefix = keyof typeof sdks
