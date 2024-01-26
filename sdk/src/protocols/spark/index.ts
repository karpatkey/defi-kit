import { NotFoundError } from "../../errors"
import tokens from "./_info"
import { Token } from "./types"
import {
  depositEther,
  depositToken,
  depositDsr,
  borrowEther,
  borrowToken,
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
    targets: ("DSR_sDAI" | "ETH" | Token["symbol"] | Token["token"])[]
  }) => {
    return targets.flatMap((target) =>
      target === "DSR_sDAI"
        ? depositDsr()
        : target === "ETH"
        ? depositEther()
        : depositToken(findToken(target))
    )
  },

  borrow: async ({
    tokens = allTokenSymbols,
  }: {
    tokens: ("ETH" | Token["symbol"] | Token["token"])[]
  }) => {
    return tokens.flatMap((token) =>
      token === "ETH" ? borrowEther() : borrowToken(findToken(token))
    )
  },
}

const allTokenSymbols = [...tokens.map((token) => token.symbol), "ETH"] as (
  | "ETH"
  | Token["symbol"]
)[]
