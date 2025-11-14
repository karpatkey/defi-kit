import ethMarkets from "./_ethInfo"
import arb1Markets from "./_arb1Info"
import baseMarkets from "./_baseInfo"

export type EthMarket = (typeof ethMarkets)[number]
export type Arb1Market = (typeof arb1Markets)[number]
export type BaseMarket = (typeof baseMarkets)[number]
export type Market = EthMarket | Arb1Market | BaseMarket
