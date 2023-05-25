import { z } from "zod"
import { zx } from "../../zx"

export const gor = {
  swap: z.object({
    sell: zx.address().array().optional(),
    buy: zx.address().array().optional(),
  }),
}
