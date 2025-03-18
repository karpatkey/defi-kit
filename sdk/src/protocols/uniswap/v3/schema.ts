import { z } from "zod"
import EthInfo from "./_ethInfo"
import GnoInfo from "./_gnoInfo"
import Arb1Info from "./_arb1Info"
import OethInfo from "./_oethInfo"
import BaseInfo from "./_baseInfo"
import { FEES } from "./types"

const ethTokens = [
  ...new Set(EthInfo.flatMap((token) => [token.address, token.symbol])),
]
const gnoTokens = [
  ...new Set(GnoInfo.flatMap((token) => [token.address, token.symbol])),
]
const arb1Tokens = [
  ...new Set(Arb1Info.flatMap((token) => [token.address, token.symbol])),
]
const oethTokens = [
  ...new Set(OethInfo.flatMap((token) => [token.address, token.symbol])),
]
const baseTokens = [
  ...new Set(BaseInfo.flatMap((token) => [token.address, token.symbol])),
]

const zEthToken = z.enum(ethTokens as [string, string, ...string[]])
const zGnoToken = z.enum(gnoTokens as [string, string, ...string[]])
const zArb1Token = z.enum(arb1Tokens as [string, string, ...string[]])
const zOethToken = z.enum(oethTokens as [string, string, ...string[]])
const zBaseToken = z.enum(baseTokens as [string, string, ...string[]])

const zFee = z.enum(FEES)

export const eth = {
  deposit: z.object({
    targets: z.string().array().optional(),
    tokens: zEthToken.array().optional(),
    fees: zFee.array().optional(),
  }),
}

export const gno = {
  deposit: z.object({
    targets: z.string().array().optional(),
    tokens: zGnoToken.array().optional(),
    fees: zFee.array().optional(),
  }),
}

export const arb1 = {
  deposit: z.object({
    targets: z.string().array().optional(),
    tokens: zArb1Token.array().optional(),
    fees: zFee.array().optional(),
  }),
}

export const oeth = {
  deposit: z.object({
    targets: z.string().array().optional(),
    tokens: zOethToken.array().optional(),
    fees: zFee.array().optional(),
  }),
}

export const base = {
  deposit: z.object({
    targets: z.string().array().optional(),
    tokens: zBaseToken.array().optional(),
    fees: zFee.array().optional(),
  }),
}
