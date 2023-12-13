import { NotFoundError } from "../../../errors"
import tokens from "./_info"
import delegateTokens from "./delegateTokens"
import { Token, DelegateToken } from "./types"
import {
  depositEther,
  depositToken,
  borrowEther,
  borrowToken,
  stake,
  delegate,
} from "./actions"

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

export const findDelegateToken = (nameOrAddress: string): DelegateToken => {
  const symbolAddressLower = nameOrAddress.toLowerCase()
  const delegateToken = delegateTokens.find(
    (delegateToken) =>
      delegateToken.address.toLowerCase() === symbolAddressLower ||
      delegateToken.symbol.toLowerCase() === symbolAddressLower
  )
  if (!delegateToken) {
    throw new NotFoundError(`Token not found: ${nameOrAddress}`)
  }
  return delegateToken
}

export const eth = {
  deposit: async ({
    targets,
  }: {
    targets: ("ETH" | Token["symbol"] | Token["token"])[]
  }) => {
    return targets.flatMap((target) =>
      target === "ETH" ? depositEther() : depositToken(findToken(target))
    )
  },

  borrow: async ({
    tokens,
  }: {
    tokens: ("ETH" | Token["symbol"] | Token["token"])[]
  }) => {
    return tokens.flatMap((token) =>
      token === "ETH" ? borrowEther() : borrowToken(findToken(token))
    )
  },

  stake: async () => {
    return stake()
  },

  delegate: async ({
    targets,
    delegatee,
  }: {
    targets: (DelegateToken["address"] | DelegateToken["symbol"])[]
    delegatee: string
  }) => {
    return targets.flatMap((target) =>
      delegate(findDelegateToken(target), delegatee)
    )
  },
}
