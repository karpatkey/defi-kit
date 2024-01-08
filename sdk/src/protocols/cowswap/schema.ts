import { z } from "zod"
import { zx } from "../../zx"

const swap = z.object({
  sell: zx.address().array(),
  buy: zx.address().array().optional(),
})

export const eth = {
  swap,
}

export const gno = {
  swap,
}