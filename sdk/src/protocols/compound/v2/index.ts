import { NotFoundError } from "../../../errors"
import tokens from "./tokens"
import { Token } from "./types"
import { deposit, borrow } from "./actions"

const findToken = (
  tokens: readonly Token[],
  symbolOrAddress: string
): Token => {
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
  deposit: ({ target }: { target: Token["symbol"] | Token["token"] }) => {
    return deposit(findToken(tokens, target))
  },
  borrow: ({ target }: { target: Token["symbol"] | Token["token"] }) => {
    return borrow(findToken(tokens, target))
  },
}
