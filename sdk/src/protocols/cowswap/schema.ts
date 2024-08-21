import { z } from "zod"
import { zx } from "../../zx"

const swap = z.object({
  sell: zx.address().or(z.literal("ETH")).array(),
  buy: zx.address().or(z.literal("ETH")).array().optional(),
  feeAmountBp: z.number().int().min(0).max(10000).optional(),
})

const swap_gno = z.object({
  sell: zx.address().or(z.literal("XDAI")).array(),
  buy: zx.address().or(z.literal("XDAI")).array().optional(),
  feeAmountBp: z.number().int().min(0).max(10000).optional(),
})

export const eth = {
  swap,
}

export const gno = {
  swap_gno,
}

export const arb1 = {
  swap,
}
