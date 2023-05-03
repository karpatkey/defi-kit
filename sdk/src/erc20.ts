import { c, forAll } from "zodiac-roles-sdk"

export const allowErc20Approve = (tokens: string[], spenders: string[]) =>
  forAll(tokens, {
    signature: "approve(address,uint256)",
    condition: c.matchesAbi([ spenders.length === 1 ? spenders[0] : c.or(...spenders as [string, string, ...string[]])], ['address', 'uint256'])
  })
