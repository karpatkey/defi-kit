import { z } from "zod"
import { zx } from "../../zx"

export const eth = {
  deposit: z.object({
    targets: z.string().array().optional(),
    avatar: zx.address(),
  }),

  borrow: z.object({
    targets: z.string().array().optional(),
    avatar: zx.address(),
  }),
}
