import { formatBytes32String, parseBytes32String } from "ethers/lib/utils"

export const encodeBytes32String = formatBytes32String as (
  text: string
) => `0x${string}`

export const decodeBytes32String = parseBytes32String as (
  bytes: `0x${string}`
) => string
