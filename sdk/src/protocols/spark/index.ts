import { NotFoundError } from "../../errors"
import ethTokens from "./_ethInfo"
import gnoTokens from "./_gnoInfo"
import { EthToken, GnoToken, Token } from "./types"
import {
  depositEther,
  depositToken,
  depositDsr,
  depositUSDC,
  depositUSDS,
  depositUSDT,
  borrowEther,
  borrowToken,
  stake,
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
    targets: (
      | "DSR_sDAI"
      | "SKY_USDC"
      | "SKY_USDS"
      | "SKY_USDT"
      | "ETH"
      | EthToken["symbol"]
      | EthToken["token"]
    )[]
  }) => {
    return targets.flatMap((target) =>
      target === "DSR_sDAI"
        ? depositDsr(Chain.eth)
        : target === "SKY_USDS"
        ? depositUSDS()
        : target === "SKY_USDC"
        ? depositUSDC()
        : target === "SKY_USDT"
        ? depositUSDT()
        : target === "ETH"
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

  stake: async () => {
    return stake()
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
