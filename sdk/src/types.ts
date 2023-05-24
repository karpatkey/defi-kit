import { PresetAllowEntry } from "zodiac-roles-sdk"

export enum Action {
  deposit = "deposit",
  borrow = "borrow",
  stake = "stake",
  claim = "claim",
  swap = "swap",
}

export enum Protocol {
  curve = "curve",
}

export type ProtocolActions = {
  [Action.deposit]?: (...args: any[]) => PresetAllowEntry[]
  [Action.borrow]?: (...args: any[]) => PresetAllowEntry[]
  [Action.stake]?: (...args: any[]) => PresetAllowEntry[]
  [Action.claim]?: (...args: any[]) => PresetAllowEntry[]
  [Action.swap]?: (...args: any[]) => PresetAllowEntry[]
}
