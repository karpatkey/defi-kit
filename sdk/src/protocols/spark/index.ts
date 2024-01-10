import { NotFoundError } from "../../errors"
import tokens from "./_info"
import { Token } from "./types"
import {
  depositEther,
  depositToken,
  borrowEther,
  borrowTokens,
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
    tokens = allTokenSymbols,
  }: {
    tokens: ("ETH" | Token["symbol"] | Token["token"])[]
  }) => {
    const result = []
    if (tokens.includes("ETH")) {
      result.push(...borrowEther())
    }

    const erc20Tokens = tokens.filter((token) => token !== "ETH").map(findToken)
    if (erc20Tokens.length) {
      result.push(...borrowTokens(erc20Tokens))
    }

    return result
  },
}

const allTokenSymbols = [...tokens.map((token) => token.symbol), "ETH"] as (
  | "ETH"
  | Token["symbol"]
)[]
