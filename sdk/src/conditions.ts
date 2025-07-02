import { c, forAll } from "zodiac-roles-sdk"

export const oneOf = <T>(values: readonly T[]) => {
  if (values.length === 0) {
    throw new Error("`oneOf` values must not be empty")
  }

  return values.length === 1 ? values[0] : c.or(...(values as [T, T, ...T[]]))
}

export const allowErc20Approve = (
  tokens: readonly `0x${string}`[],
  spenders: readonly `0x${string}`[]
) =>
  forAll(tokens, {
    signature: "approve(address,uint256)",
    condition: c.calldataMatches([oneOf(spenders)], ["address", "uint256"]),
  })
