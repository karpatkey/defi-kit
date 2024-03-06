import { z } from "zod"
import { zx } from "../../zx"
import EthInfo from "./_ethInfo"

const ethTokens = [
  ...new Set(EthInfo.flatMap((token) => [token.address, token.symbol])),
]

const zToken = z.enum(ethTokens as [string, string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: z.string().array().optional(),
    tokens: zToken.array().optional(),
    avatar: zx.address(),
  }),
}
