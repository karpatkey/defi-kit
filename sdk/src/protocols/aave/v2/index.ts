import { NotFoundError } from "../../../errors"
import tokens from "./tokens"
import { Token } from "./types"
import { depositEther, depositToken } from "./deposit"

const findToken = (
  tokens: readonly Token[],
  symbolOrAddress: string
): Token => {
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
    target,
  }: {
    target: "ETH" | Token["symbol"] | Token["token"]
  }) => {
    return target === "ETH"
      ? depositEther()
      : depositToken(findToken(tokens, target))
  },
  borrow: () => [],
  stake: () => [],
}
