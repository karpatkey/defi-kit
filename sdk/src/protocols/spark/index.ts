import { NotFoundError } from "../../errors"
import ethTokens from "./_ethInfo"
import gnoTokens from "./_gnoInfo"
import { EthToken, GnoToken, Token } from "./types"
import {
  depositEther,
  depositToken,
  depositDsr,
  borrowEther,
  borrowToken,
} from "./actions"
import { Chain } from "../../types"

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
    targets: ("DSR_sDAI" | "ETH" | EthToken["symbol"] | EthToken["token"])[]
  }) => {
    return targets.flatMap((target) =>
      target === "DSR_sDAI"
        ? depositDsr(Chain.eth)
        : target === "ETH"
        ? depositEther()
        : depositToken(findToken(ethTokens, target))
    )
  },

  borrow: async ({
    targets,
  }: {
    targets: ("ETH" | EthToken["symbol"] | EthToken["token"])[]
  }) => {
    return targets.flatMap((target) =>
      target === "ETH"
        ? borrowEther()
        : borrowToken(findToken(ethTokens, target))
    )
  },
}

export const gno = {
  deposit: async ({
    targets,
  }: {
    targets: ("DSR_sDAI" | "XDAI" | GnoToken["symbol"] | GnoToken["token"])[]
  }) => {
    return targets.flatMap((target) =>
      target === "DSR_sDAI"
        ? depositDsr(Chain.gno)
        : target === "XDAI"
        ? depositEther()
        : depositToken(findToken(gnoTokens, target))
    )
  },
}
