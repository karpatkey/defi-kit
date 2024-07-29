import { z } from "zod"
import { zx } from "../../zx"

const swap = z.object({
  sell: zx.address().or(z.literal("ETH")).array(),
  buy: zx.address().or(z.literal("ETH")).array().optional(),
  fee_amount_bp: z.number().int().min(0).max(10000).optional()
})

export const eth = {
  swap,
}

export const gno = {
  swap,
}
