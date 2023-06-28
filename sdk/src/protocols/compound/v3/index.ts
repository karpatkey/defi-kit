import { NotFoundError } from "../../../errors"
import comets from "./_comets"
import { Comet, Collaterals } from "./types"
import { deposit, borrow } from "./actions"


const findComet = (
  comets: readonly Comet[],
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
  collaterals: readonly Collaterals[],
  symbolOrAddress: string
) => {
  const symbolAddressLower = symbolOrAddress.toLowerCase()
  const collateral = collaterals.find(
    (collateral) =>
      collateral.symbol.toLowerCase() === symbolAddressLower ||
      collateral.address.toLowerCase() === symbolAddressLower
  )
  if (!collateral) {
    throw new NotFoundError(`Collateral not found: ${symbolOrAddress}`)
  }
  return collateral
}

export const eth = {
  deposit: ({
    target,
  }: {
    target: Comet["symbol"] | Comet["address"],
    tokens?: (Comet['collateralTokens'][number]['address'] | Comet['collateralTokens'][number]['symbol'])[]
  }) => {
      return deposit(findComet(comets, target), tokens.map(findToken()))
  },
  borrow: () => {
    return borrow()
  }
}
