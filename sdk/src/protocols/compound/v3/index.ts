import { NotFoundError } from "../../../errors"
import comets from "./_comets"
import { Comet } from "./types"
import { deposit, borrow } from "./actions"


const findComet = (
  symbolOrAddress: string
): Comet => {
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

const findToken = (
  symbolOrAddress: string
) => {
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

export const eth = {
  deposit: ({
    target,
  }: {
    target: Comet["symbol"] | Comet["address"],
    tokens?: (Comet['collateralTokens'][number]['address'] | Comet['collateralTokens'][number]['symbol'])[]
  }) => {
      return deposit(findComet(comets, target), tokens.map(findToken))
  },
  borrow: () => {
    return borrow()
  }
}
