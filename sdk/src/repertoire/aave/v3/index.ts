import { Chain } from "../../../../src"
import { depositOptions } from "./actions"
import {
  EthToken,
  EthMarket,
  GnoToken,
  Arb1Token,
  OethToken,
  BaseToken,
} from "../../../protocols/aave/v3/types"

export const eth = {
  deposit: async ({
    token,
    market,
  }: {
    token: "ETH" | EthToken["symbol"] | EthToken["token"]
    market?: EthMarket["name"] | EthMarket["poolAddress"]
  }) => depositOptions(Chain.eth, token, market),
}

export const gno = {
  deposit: async ({
    token,
  }: {
    token: "XDAI" | GnoToken["symbol"] | GnoToken["token"]
  }) => depositOptions(Chain.gno, token),
}

export const arb1 = {
  deposit: async ({
    token,
  }: {
    token: "ETH" | Arb1Token["symbol"] | Arb1Token["token"]
  }) => depositOptions(Chain.arb1, token),
}

export const oeth = {
  deposit: async ({
    token,
  }: {
    token: "ETH" | OethToken["symbol"] | OethToken["token"]
  }) => depositOptions(Chain.oeth, token),
}

export const base = {
  deposit: async ({
    token,
  }: {
    token: "ETH" | BaseToken["symbol"] | BaseToken["token"]
  }) => depositOptions(Chain.base, token),
}
