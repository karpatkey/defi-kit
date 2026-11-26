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

/**
 * Resolves a `borrow` target, which may be either a comet (symbol or address)
 * or a borrow token (symbol or address).
 *
 * Several comets can share a borrow token - USDC is the base asset of both
 * cUSDCv3 and ciUSDCv3 - and a borrow token alone cannot distinguish between
 * them. Comet identifiers are therefore tried first, so that a market with an
 * ambiguous borrow token can still be targeted explicitly. Resolution by
 * borrow token is unchanged and keeps returning the first matching comet, so
 * existing policies written against a token symbol are unaffected.
 */
const findCometForBorrow = (symbolOrAddress: string): Comet => {
  const symbolAddressLower = symbolOrAddress.toLowerCase()

  const cometByIdentifier = comets.find(
    (comet) =>
      comet.symbol.toLowerCase() === symbolAddressLower ||
      comet.address.toLowerCase() === symbolAddressLower
  )
  if (cometByIdentifier) {
    return cometByIdentifier
  }

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

const findTokenByComet = (comet: Comet, symbolOrAddress: string): Token => {
  const symbolAddressLower = symbolOrAddress.toLowerCase()
  const tokens = [comet.borrowToken, ...comet.collateralTokens]
  const token = tokens.find(
    (token) =>
      token.symbol.toLowerCase() === symbolAddressLower ||
      token.address.toLowerCase() === symbolAddressLower
  )
  if (!token) {
    throw new NotFoundError(
      `Token not found for ${symbolOrAddress} in comet ${comet.symbol}`
    )
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
    return targets.flatMap((target) => {
      const comet = findComet(target)
      const resolvedTokens = tokens?.map((token) =>
        findTokenByComet(comet, token)
      )
      return deposit(comet, resolvedTokens)
    })
  },

  borrow: async ({
    targets,
  }: {
    targets: (
      | Comet["symbol"]
      | Comet["address"]
      | BorrowToken["symbol"]
      | BorrowToken["address"]
    )[]
  }) => {
    return targets.flatMap((target) => borrow(findCometForBorrow(target)))
  },
}
