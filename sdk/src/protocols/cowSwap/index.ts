import { Chain } from "../../types"
import { swap } from "./actions"

export const eth = {
  swap: (options: {
    sell: (`0x${string}` | "ETH")[]
    buy?: (`0x${string}` | "ETH")[]
    feeAmountBp?: number
    twap?: boolean
    receiver?: `0x${string}`
  }) => swap(options, Chain.eth),
}

export const gno = {
  swap: (options: {
    sell: (`0x${string}` | "XDAI")[]
    buy?: (`0x${string}` | "XDAI")[]
    feeAmountBp?: number
    twap?: boolean
    receiver?: `0x${string}`
  }) => swap(options, Chain.gno),
}

export const arb1 = {
  swap: (options: {
    sell: (`0x${string}` | "ETH")[]
    buy?: (`0x${string}` | "ETH")[]
    feeAmountBp?: number
    twap?: boolean
    receiver?: `0x${string}`
  }) => swap(options, Chain.arb1),
}

export const base = {
  swap: (options: {
    sell: (`0x${string}` | "ETH")[]
    buy?: (`0x${string}` | "ETH")[]
    feeAmountBp?: number
    twap?: boolean
    receiver?: `0x${string}`
  }) => swap(options, Chain.base),
}
