import { NotFoundError } from "../../../errors"
import tokens from "./_info"
import delegateTokens from "./delegateTokens"
import stakeTokens from "./stakeTokens"
import { Token, DelegateToken, StakeToken } from "./types"
import {
  depositEther,
  depositToken,
  borrowEther,
  borrowToken,
  stake,
  delegate,
} from "./actions"

const findToken = (symbolOrAddress: string): Token => {
  const symbolOrAddressLower = symbolOrAddress.toLowerCase()
  const token = tokens.find(
    (token) =>
      token.symbol.toLowerCase() === symbolOrAddressLower ||
      token.token.toLowerCase() === symbolOrAddressLower
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

export const findStakeToken = (nameOrAddress: string): StakeToken => {
  const symbolAddressLower = nameOrAddress.toLowerCase()
  const stakeToken = stakeTokens.find(
    (stakeToken) =>
      stakeToken.address.toLowerCase() === symbolAddressLower ||
      stakeToken.symbol.toLowerCase() === symbolAddressLower
  )
  if (!stakeToken) {
    throw new NotFoundError(`Token not found: ${nameOrAddress}`)
  }
  return stakeToken
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
    targets,
  }: {
    targets: ("ETH" | Token["symbol"] | Token["token"])[]
  }) => {
    return targets.flatMap((target) =>
      target === "ETH" ? borrowEther() : borrowToken(findToken(target))
    )
  },

  stake: async ({
    targets,
  }: {
    targets: (StakeToken["address"] | StakeToken["symbol"])[]
  }) => {
    return targets.flatMap((token) => stake(findStakeToken(token)))
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
