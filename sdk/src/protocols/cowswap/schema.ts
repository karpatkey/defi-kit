import { z } from "zod"
import { zx } from "../../zx"

const swap = z.object({
  sell: zx.address().or(z.literal("ETH")).array(),
  buy: zx.address().or(z.literal("ETH")).array(),
})

export const eth = {
  swap,
}

export const gno = {
  swap,
}
