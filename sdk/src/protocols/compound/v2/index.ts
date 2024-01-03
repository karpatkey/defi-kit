import { NotFoundError } from "../../../errors"
import tokens from "./_info"
import { Token } from "./types"
import { deposit, borrow } from "./actions"

const findToken = (symbolOrAddress: string): Token => {
  const nameOrAddressLower = symbolOrAddress.toLowerCase()
  const token = tokens.find(
    (token) =>
      token.symbol.toLowerCase() === nameOrAddressLower ||
      token.token.toLowerCase() === nameOrAddressLower
  )
  if (!token) {
    throw new NotFoundError(`Token not found: ${symbolOrAddress}`)
  }
  return token
}

export const eth = {
  deposit: async ({
    targets,
  }: {
    targets: (Token["symbol"] | Token["token"])[]
  }) => {
    return targets.flatMap((target) => deposit(findToken(target)))
  },

  borrow: async ({
    tokens,
  }: {
    tokens: (Token["symbol"] | Token["token"])[]
  }) => {
    return tokens.flatMap((token) => borrow(findToken(token)))
  },
}
