import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"

const tokenListScoping = (tokens?: string[]) =>
  !tokens || tokens.length === 0
    ? undefined
    : tokens.length === 1
    ? tokens[0]
    : c.or(...(tokens as [string, string, ...string[]]))

const swap = (options: { sell?: string[]; buy?: string[] }) => {
  const sellScoping = tokenListScoping(options.sell)
  const buyScoping = tokenListScoping(options.buy)
  return [allow.goerli.cowswap.orderSigner.signOrder(sellScoping, buyScoping)]
}

export const gor = {
  swap,
}
