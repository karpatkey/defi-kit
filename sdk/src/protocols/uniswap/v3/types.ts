import ethInfo from "./_ethInfo"
import gnoInfo from "./_gnoInfo"
import arb1Info from "./_arb1Info"
import oethInfo from "./_oethInfo"
import baseInfo from "./_baseInfo"

export type EthToken = (typeof ethInfo)[number]
export type GnoToken = (typeof gnoInfo)[number]
export type Arb1Token = (typeof arb1Info)[number]
export type OethToken = (typeof oethInfo)[number]
export type BaseToken = (typeof baseInfo)[number]

export const FEES = ["0.01%", "0.05%", "0.3%", "1%"] as const

export type Fee = (typeof FEES)[number]
