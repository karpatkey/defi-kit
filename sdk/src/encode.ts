import {
  encodeBytes32String as encodeBytes32StringBase,
  decodeBytes32String as decodeBytes32StringBase,
} from "ethers"

export const encodeBytes32String = encodeBytes32StringBase as (
  text: string
) => `0x${string}`

export const decodeBytes32String = decodeBytes32StringBase as (
  bytes: `0x${string}`
) => string
