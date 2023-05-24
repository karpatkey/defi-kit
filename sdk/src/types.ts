import { PresetAllowEntry } from "zodiac-roles-sdk"

export enum Action {
  deposit = "deposit",
  lend = "lend",
  stake = "stake",
  claim = "claim",
  swap = "swap",
}

export enum Protocol {
  curve = "curve",
}

export type Deposit = (pool: string) => PresetAllowEntry[]
export type Swap = (pool: string) => PresetAllowEntry[]
