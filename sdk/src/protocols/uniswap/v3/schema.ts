import { z } from "zod"
import EthInfo from "./_ethInfo"
import { FEES } from "./types"

const ethTokens = [
  ...new Set(EthInfo.flatMap((token) => [token.address, token.symbol])),
]

const zToken = z.enum(ethTokens as [string, string, ...string[]])

const zFee = z.enum(FEES)

export const eth = {
  deposit: z.object({
    targets: z.string().array().optional(),
    tokens: zToken.array().optional(),
    fees: zFee.array().optional(),
  }),
}
