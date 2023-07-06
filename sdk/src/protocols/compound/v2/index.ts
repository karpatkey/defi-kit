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
  deposit: ({ targets }: { targets: (Token["symbol"] | Token["token"])[] }) => {
    return targets.flatMap((target) => deposit(findToken(tokens, target)))
  },
  borrow: ({ targets }: { targets: (Token["symbol"] | Token["token"])[] }) => {
    return targets.flatMap((target) => borrow(findToken(tokens, target)))
  },
}
