import { NotFoundError } from "../../../errors"
import comets from "./_comets"
import { Comet, Token } from "./types"
import { deposit, borrow } from "./actions"

const findComet = (symbolOrAddress: string): Comet => {
  const symbolAddressLower = symbolOrAddress.toLowerCase()
  const comet = comets.find(
    (comet) =>
      comet.symbol.toLowerCase() === symbolAddressLower ||
      comet.address.toLowerCase() === symbolAddressLower
  )
  if (!comet) {
    throw new NotFoundError(`Comet not found: ${symbolOrAddress}`)
  }
  return comet
}

const findToken = (symbolOrAddress: string) => {
  const symbolAddressLower = symbolOrAddress.toLowerCase()
  const tokens = comets.flatMap((comet) => [
    comet.borrowToken,
    ...comet.collateralTokens,
  ])
  const token = tokens.find(
    (token) =>
      token.symbol.toLowerCase() === symbolAddressLower ||
      token.address.toLowerCase() === symbolAddressLower
  )
  if (!token) {
    throw new NotFoundError(`Token not found: ${symbolOrAddress}`)
  }
  return token
}

export const eth = {
  deposit: ({
    target,
    tokens,
  }: {
    target: Comet["symbol"] | Comet["address"]
    tokens?: (Token["address"] | Token["symbol"])[]
  }) => {
    return deposit(findComet(target), tokens?.map(findToken))
  },
  borrow: () => {
    return borrow()
  },
}
