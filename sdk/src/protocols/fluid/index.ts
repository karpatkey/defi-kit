import { NotFoundError } from "../../errors"
import arb1Tokens from "./_arb1Info"
import baseTokens from "./_baseInfo"
import ethTokens from "./_ethInfo"
import { Arb1Token, BaseToken, EthToken, Token } from "./types"
import { depositEther, depositToken } from "./actions"
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
    targets: ("ETH" | EthToken["symbol"] | EthToken["token"])[]
  }) => {
    return targets.flatMap((target) =>
      target === "ETH"
        ? depositEther(Chain.eth)
        : depositToken(Chain.eth, findToken(ethTokens, target))
    )
  },
}

export const arb1 = {
  deposit: async ({
    targets,
  }: {
    targets: ("ETH" | Arb1Token["symbol"] | Arb1Token["token"])[]
  }) => {
    return targets.flatMap((target) =>
      target === "ETH"
        ? depositEther(Chain.arb1)
        : depositToken(Chain.arb1, findToken(arb1Tokens, target))
    )
  },
}

export const base = {
  deposit: async ({
    targets,
  }: {
    targets: ("ETH" | BaseToken["symbol"] | BaseToken["token"])[]
  }) => {
    return targets.flatMap((target) =>
      target === "ETH"
        ? depositEther(Chain.base)
        : depositToken(Chain.base, findToken(baseTokens, target))
    )
  },
}
