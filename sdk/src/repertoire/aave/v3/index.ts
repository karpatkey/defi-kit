import { Chain } from "../../../../src"
import {
  depositOptions,
  withdrawOptions,
  collateralisationOptions,
} from "./actions"
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
    market,
    token,
  }: {
    market?: EthMarket["name"] | EthMarket["poolAddress"]
    token: "ETH" | EthToken["symbol"] | EthToken["token"]
  }) => depositOptions(Chain.eth, token, market),

  withdraw: async ({
    market,
    token,
  }: {
    market?: EthMarket["name"] | EthMarket["poolAddress"]
    token: "ETH" | EthToken["symbol"] | EthToken["token"]
  }) => withdrawOptions(Chain.eth, token, market),

  set_collateralisation: async ({
    market,
    token,
    useAsCollateral,
  }: {
    market?: EthMarket["name"] | EthMarket["poolAddress"]
    token: "ETH" | EthToken["symbol"] | EthToken["token"]
    useAsCollateral: boolean
  }) => collateralisationOptions(Chain.eth, token, useAsCollateral, market),
}

export const gno = {
  deposit: async ({
    token,
  }: {
    token: "XDAI" | GnoToken["symbol"] | GnoToken["token"]
  }) => depositOptions(Chain.gno, token),

  withdraw: async ({
    token,
  }: {
    token: "XDAI" | GnoToken["symbol"] | GnoToken["token"]
  }) => withdrawOptions(Chain.gno, token),

  set_collateralisation: async ({
    token,
    useAsCollateral,
  }: {
    token: "XDAI" | GnoToken["symbol"] | GnoToken["token"]
    useAsCollateral: boolean
  }) => collateralisationOptions(Chain.gno, token, useAsCollateral),
}

export const arb1 = {
  deposit: async ({
    token,
  }: {
    token: "ETH" | Arb1Token["symbol"] | Arb1Token["token"]
  }) => depositOptions(Chain.arb1, token),

  withdraw: async ({
    token,
  }: {
    token: "ETH" | Arb1Token["symbol"] | Arb1Token["token"]
  }) => withdrawOptions(Chain.arb1, token),

  set_collateralisation: async ({
    token,
    useAsCollateral,
  }: {
    token: "ETH" | Arb1Token["symbol"] | Arb1Token["token"]
    useAsCollateral: boolean
  }) => collateralisationOptions(Chain.arb1, token, useAsCollateral),
}

export const oeth = {
  deposit: async ({
    token,
  }: {
    token: "ETH" | OethToken["symbol"] | OethToken["token"]
  }) => depositOptions(Chain.oeth, token),

  withdraw: async ({
    token,
  }: {
    token: "ETH" | OethToken["symbol"] | OethToken["token"]
  }) => withdrawOptions(Chain.oeth, token),

  set_collateralisation: async ({
    token,
    useAsCollateral,
  }: {
    token: "ETH" | OethToken["symbol"] | OethToken["token"]
    useAsCollateral: boolean
  }) => collateralisationOptions(Chain.oeth, token, useAsCollateral),
}

export const base = {
  deposit: async ({
    token,
  }: {
    token: "ETH" | BaseToken["symbol"] | BaseToken["token"]
  }) => depositOptions(Chain.base, token),

  withdraw: async ({
    token,
  }: {
    token: "ETH" | BaseToken["symbol"] | BaseToken["token"]
  }) => withdrawOptions(Chain.base, token),

  set_collateralisation: async ({
    token,
    useAsCollateral,
  }: {
    token: "ETH" | BaseToken["symbol"] | BaseToken["token"]
    useAsCollateral: boolean
  }) => collateralisationOptions(Chain.base, token, useAsCollateral),
}
