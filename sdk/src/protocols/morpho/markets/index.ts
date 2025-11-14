import { NotFoundError } from "../../../errors"
import ethMarkets from "./_ethInfo"
import arb1Markets from "./_arb1Info"
import baseMarkets from "./_baseInfo"
import { EthMarket, Arb1Market, BaseMarket, Market } from "./types"
import { deposit, borrow } from "./actions"
import { Chain } from "../../../types"

export const findMarket = (
  markets: readonly Market[],
  marketId: string
): Market => {
  const market = markets.find(
    (market) => market.id.toLowerCase() === marketId.toLowerCase()
  )
  if (!market) {
    throw new NotFoundError(`Market not found: ${marketId}`)
  }
  return market
}

export const eth = {
  deposit: async ({ targets }: { targets: EthMarket["id"][] }) => {
    return targets.flatMap((target) =>
      deposit(Chain.eth, findMarket(ethMarkets, target))
    )
  },

  borrow: async ({ targets }: { targets: EthMarket["id"][] }) => {
    return targets.flatMap((target) =>
      borrow(Chain.eth, findMarket(ethMarkets, target))
    )
  },
}

export const arb1 = {
  deposit: async ({ targets }: { targets: Arb1Market["id"][] }) => {
    return targets.flatMap((target) =>
      deposit(Chain.arb1, findMarket(arb1Markets, target))
    )
  },

  borrow: async ({ targets }: { targets: Arb1Market["id"][] }) => {
    return targets.flatMap((target) =>
      borrow(Chain.arb1, findMarket(arb1Markets, target))
    )
  },
}

export const base = {
  deposit: async ({ targets }: { targets: BaseMarket["id"][] }) => {
    return targets.flatMap((target) =>
      deposit(Chain.base, findMarket(baseMarkets, target))
    )
  },

  borrow: async ({ targets }: { targets: BaseMarket["id"][] }) => {
    return targets.flatMap((target) =>
      borrow(Chain.base, findMarket(baseMarkets, target))
    )
  },
}
