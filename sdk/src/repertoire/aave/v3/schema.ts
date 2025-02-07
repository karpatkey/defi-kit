import { z } from "zod"
import ethCoreTokens from "../../../protocols/aave/v3/_ethCoreInfo"
import ethPrimeTokens from "../../../protocols/aave/v3/_ethPrimeInfo"
import ethEtherFiTokens from "../../../protocols/aave/v3/_ethEtherFiInfo"
import ethMarkets from "../../../protocols/aave/v3/_ethMarketInfo"
import gnoTokens from "../../../protocols/aave/v3/_gnoCoreInfo"
import arb1Tokens from "../../../protocols/aave/v3/_arb1CoreInfo"
import oethTokens from "../../../protocols/aave/v3/_oethCoreInfo"
import baseTokens from "../../../protocols/aave/v3/_baseCoreInfo"

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

const marketNames = ethMarkets.map((market) => market.name)
const marketPoolAddresses = ethMarkets.map((market) => market.poolAddress)

// Create a Zod schema for markets
export const zMarket = z.enum([...marketNames, ...marketPoolAddresses] as [
  string,
  ...string[]
])

export const eth = {
  deposit: z.object({
    market: zMarket.optional().default("Core"), // Default to "Core"
    token: zEthToken,
  }),

  withdraw: z.object({
    market: zMarket.optional().default("Core"), // Default to "Core"
    token: zEthToken,
  }),

  set_collateralisation: z.object({
    market: zMarket.optional().default("Core"), // Default to "Core"
    token: zEthToken,
    useAsCollateral: z.boolean(),
  }),
}

export const gno = {
  deposit: z.object({
    token: z.enum([
      "XDAI",
      ...gnoTokens.map((token) => token.symbol),
      ...gnoTokens.map((token) => token.token),
    ] as [string, string, ...string[]]),
  }),

  withdraw: z.object({
    token: z.enum([
      "XDAI",
      ...gnoTokens.map((token) => token.symbol),
      ...gnoTokens.map((token) => token.token),
    ] as [string, string, ...string[]]),
  }),

  set_collateralisation: z.object({
    token: z.enum([
      "XDAI",
      ...gnoTokens.map((token) => token.symbol),
      ...gnoTokens.map((token) => token.token),
    ] as [string, string, ...string[]]),
    useAsCollateral: z.boolean(),
  }),
}

export const arb1 = {
  deposit: z.object({
    token: z.enum([
      "ETH",
      ...arb1Tokens.map((token) => token.symbol),
      ...arb1Tokens.map((token) => token.token),
    ] as [string, string, ...string[]]),
  }),

  withdraw: z.object({
    token: z.enum([
      "ETH",
      ...arb1Tokens.map((token) => token.symbol),
      ...arb1Tokens.map((token) => token.token),
    ] as [string, string, ...string[]]),
  }),

  set_collateralisation: z.object({
    token: z.enum([
      "ETH",
      ...arb1Tokens.map((token) => token.symbol),
      ...arb1Tokens.map((token) => token.token),
    ] as [string, string, ...string[]]),
    useAsCollateral: z.boolean(),
  }),
}

export const oeth = {
  deposit: z.object({
    token: z.enum([
      "ETH",
      ...oethTokens.map((token) => token.symbol),
      ...oethTokens.map((token) => token.token),
    ] as [string, string, ...string[]]),
  }),

  withdraw: z.object({
    token: z.enum([
      "ETH",
      ...oethTokens.map((token) => token.symbol),
      ...oethTokens.map((token) => token.token),
    ] as [string, string, ...string[]]),
  }),

  set_collateralisation: z.object({
    token: z.enum([
      "ETH",
      ...oethTokens.map((token) => token.symbol),
      ...oethTokens.map((token) => token.token),
    ] as [string, string, ...string[]]),
    useAsCollateral: z.boolean(),
  }),
}

export const base = {
  deposit: z.object({
    token: z.enum([
      "ETH",
      ...baseTokens.map((token) => token.symbol),
      ...baseTokens.map((token) => token.token),
    ] as [string, string, ...string[]]),
  }),

  withdraw: z.object({
    token: z.enum([
      "ETH",
      ...baseTokens.map((token) => token.symbol),
      ...baseTokens.map((token) => token.token),
    ] as [string, string, ...string[]]),
  }),

  set_collateralisation: z.object({
    token: z.enum([
      "ETH",
      ...baseTokens.map((token) => token.symbol),
      ...baseTokens.map((token) => token.token),
    ] as [string, string, ...string[]]),
    useAsCollateral: z.boolean(),
  }),
}
