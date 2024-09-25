import { NotFoundError } from "../../../errors"
import ethTokens from "./_ethInfo"
import gnoTokens from "./_gnoInfo"
import { EthToken, GnoToken, Token } from "./types"
import { DelegateToken, StakeToken } from "../v2/types"
import { findDelegateToken, findStakeToken } from "../v2/index"
import { depositEther, depositToken, borrowEther, borrowToken } from "./actions"
import { stake, delegate } from "../v2/actions"
import { Chain } from "../../../types"

const findToken = (
  tokens: readonly Token[],
  symbolOrAddress: string
): Token => {
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

export const eth = {
  deposit: async ({
    targets,
  }: {
    targets: ("ETH" | EthToken["symbol"] | EthToken["token"])[]
  }) => {
    return targets.flatMap((target) =>
      target === "ETH"
        ? depositEther(Chain.eth)
        : depositToken(Chain.eth, findToken(ethTokens, target))
    )
  },

  borrow: async ({
    targets,
  }: {
    targets: ("ETH" | EthToken["symbol"] | EthToken["token"])[]
  }) => {
    return targets.flatMap((target) =>
      target === "ETH"
        ? borrowEther(Chain.eth)
        : borrowToken(Chain.eth, findToken(ethTokens, target))
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

export const gno = {
  deposit: async ({
    targets,
  }: {
    targets: ("XDAI" | GnoToken["symbol"] | GnoToken["token"])[]
  }) => {
    return targets.flatMap((target) =>
      target === "XDAI"
        ? depositEther(Chain.gno)
        : depositToken(Chain.gno, findToken(gnoTokens, target))
    )
  },

  borrow: async ({
    targets,
  }: {
    targets: ("XDAI" | GnoToken["symbol"] | GnoToken["token"])[]
  }) => {
    return targets.flatMap((target) =>
      target === "XDAI"
        ? borrowEther(Chain.gno)
        : borrowToken(Chain.gno, findToken(gnoTokens, target))
    )
  },
}
