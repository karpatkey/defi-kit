import { NotFoundError } from "../../../errors"
import tokens from "./_info"
import { Token, DelegateToken } from "./types"
import { depositEther, depositToken, borrowEther, borrowToken } from "./actions"
import { stake, delegate } from "../v2/actions"

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
  deposit: ({
    targets,
  }: {
    targets: ("ETH" | Token["symbol"] | Token["token"])[]
  }) => {
    return targets.flatMap((target) =>
      target === "ETH" ? depositEther() : depositToken(findToken(target))
    )
  },

  borrow: ({
    tokens,
  }: {
    tokens: ("ETH" | Token["symbol"] | Token["token"])[]
  }) => {
    return tokens.flatMap((token) =>
      token === "ETH" ? borrowEther() : borrowToken(findToken(token))
    )
  },

  stake: () => {
    return stake()
  },

  // delegate: ({
  //   targets,
  //   delegatee,
  // }: {
  //   targets: (DelegateToken["address"] | DelegateToken["symbol"])[]
  //   delegatee: string
  // }) => {
  //   return targets.flatMap((target) =>
  //     delegate(findDelegateToken(target), delegatee)
  //   )
  // },
}
