import { z } from "zod"
import ethMarkets from "./_ethInfo"
import arb1Markets from "./_arb1Info"
import baseMarkets from "./_baseInfo"

// Extract market IDs for each chain
const ethMarketIds = ethMarkets.map((market) => market.id)
const arb1MarketIds = arb1Markets.map((market) => market.id)
const baseMarketIds = baseMarkets.map((market) => market.id)

// Create Zod schemas for markets (IDs only)
const zEthMarket = z.enum(ethMarketIds as [string, ...string[]])
const zArb1Market = z.enum(arb1MarketIds as [string, ...string[]])
const zBaseMarket = z.enum(baseMarketIds as [string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: zEthMarket.array(),
  }),

  borrow: z.object({
    targets: zEthMarket.array(),
  }),
}

export const arb1 = {
  deposit: z.object({
    targets: zArb1Market.array(),
  }),

  borrow: z.object({
    targets: zArb1Market.array(),
  }),
}

export const base = {
  deposit: z.object({
    targets: zBaseMarket.array(),
  }),

  borrow: z.object({
    targets: zBaseMarket.array(),
  }),
}
