import { z } from "zod"
import ethCoreTokens from "./_ethCoreInfo"
import ethPrimeTokens from "./_ethPrimeInfo"
import ethEtherFiTokens from "./_ethEtherFiInfo"
import ethMarkets from "./_ethMarketInfo"
import gnoTokens from "./_gnoCoreInfo"
import arb1Tokens from "./_arb1CoreInfo"
import oethTokens from "./_oethCoreInfo"
import baseTokens from "./_baseCoreInfo"
import ethStakeTokens from "../v2/_stakeTokens"
import ethDelegateTokens from "../v2/_delegateTokens"
import { zx } from "../../../zx"

// Combine tokens from all Ethereum markets into a single list
const allEthTokens = Array.from(
  new Map(
    [...ethCoreTokens, ...ethPrimeTokens, ...ethEtherFiTokens].map((token) => [
      token.symbol,
      token,
    ]) // Use symbol as a unique key
  ).values()
)

// Extract token symbols and addresses
const allEthTokenSymbols = allEthTokens.map((token) => token.symbol)
const allEthTokenAddresses = allEthTokens.map((token) => token.token)

// Token schemas
const zEthToken = z.enum([
  "ETH", // Include native ETH
  ...allEthTokenSymbols,
  ...allEthTokenAddresses,
] as [string, string, ...string[]])

const zStakeToken = z.enum([
  ...ethStakeTokens.map((token) => token.symbol),
  ...ethStakeTokens.map((token) => token.address),
] as [string, string, ...string[]])

const zDelegateToken = z.enum([
  ...ethDelegateTokens.map((token) => token.symbol),
  ...ethDelegateTokens.map((token) => token.address),
] as [string, string, ...string[]])

const zDelegatee = zx.address()

const marketNames = ethMarkets.map((market) => market.name)
const marketPoolAddresses = ethMarkets.map((market) => market.poolAddress)

// Create a Zod schema for markets
export const zMarket = z.enum([...marketNames, ...marketPoolAddresses] as [
  string,
  ...string[]
])

// Ethereum schema
export const eth = {
  deposit: z.object({
    market: zMarket.optional().default("Core"), // Default to "Core"
    targets: zEthToken.array(),
  }),

  borrow: z.object({
    market: zMarket.optional().default("Core"), // Default to "Core"
    targets: zEthToken.array(),
  }),

  stake: z.object({
    targets: zStakeToken.array(),
  }),

  delegate: z.object({
    targets: zDelegateToken.array(),
    delegatee: zDelegatee,
  }),
}

// Side chain schemas remain unchanged
export const gno = {
  deposit: z.object({
    targets: z
      .enum([
        "XDAI",
        ...gnoTokens.map((token) => token.symbol),
        ...gnoTokens.map((token) => token.token),
      ] as [string, string, ...string[]])
      .array(),
  }),

  borrow: z.object({
    targets: z
      .enum([
        "XDAI",
        ...gnoTokens.map((token) => token.symbol),
        ...gnoTokens.map((token) => token.token),
      ] as [string, string, ...string[]])
      .array(),
  }),
}

export const arb1 = {
  deposit: z.object({
    targets: z
      .enum([
        "ETH",
        ...arb1Tokens.map((token) => token.symbol),
        ...arb1Tokens.map((token) => token.token),
      ] as [string, string, ...string[]])
      .array(),
  }),

  borrow: z.object({
    targets: z
      .enum([
        "ETH",
        ...arb1Tokens.map((token) => token.symbol),
        ...arb1Tokens.map((token) => token.token),
      ] as [string, string, ...string[]])
      .array(),
  }),
}

export const oeth = {
  deposit: z.object({
    targets: z
      .enum([
        "ETH",
        ...oethTokens.map((token) => token.symbol),
        ...oethTokens.map((token) => token.token),
      ] as [string, string, ...string[]])
      .array(),
  }),

  borrow: z.object({
    targets: z
      .enum([
        "ETH",
        ...oethTokens.map((token) => token.symbol),
        ...oethTokens.map((token) => token.token),
      ] as [string, string, ...string[]])
      .array(),
  }),
}

export const base = {
  deposit: z.object({
    targets: z
      .enum([
        "ETH",
        ...baseTokens.map((token) => token.symbol),
        ...baseTokens.map((token) => token.token),
      ] as [string, string, ...string[]])
      .array(),
  }),

  borrow: z.object({
    targets: z
      .enum([
        "ETH",
        ...baseTokens.map((token) => token.symbol),
        ...baseTokens.map((token) => token.token),
      ] as [string, string, ...string[]])
      .array(),
  }),
}
