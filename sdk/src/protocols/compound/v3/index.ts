import { NotFoundError } from "../../../errors"
import comets from "./_info"
import { Comet, Token, BorrowToken } from "./types"
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

const findCometByBorrowToken = (symbolOrAddress: string): Comet => {
  const symbolAddressLower = symbolOrAddress.toLowerCase()
  const comet = comets.find(
    (comet) =>
      comet.borrowToken.symbol.toLowerCase() === symbolAddressLower ||
      comet.borrowToken.address.toLowerCase() === symbolAddressLower
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
  deposit: async ({
    targets,
    tokens,
  }: {
    targets: (Comet["symbol"] | Comet["address"])[]
    tokens?: (Token["address"] | Token["symbol"])[]
  }) => {
    return targets.flatMap((target) =>
      deposit(findComet(target), tokens?.map(findToken))
    )
  },

  borrow: async ({
    tokens,
  }: {
    tokens: (BorrowToken["symbol"] | BorrowToken["address"])[]
  }) => {
    return tokens.flatMap((token) => borrow(findCometByBorrowToken(token)))
  },
}
