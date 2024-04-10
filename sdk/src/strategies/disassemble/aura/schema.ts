import { z } from "zod"
import { zEthPool, zGnoPool } from "../../../protocols/aura/schema"

export const eth = {
  aura_proportional: z.object({
    pool: z.array(zEthPool),
  }),

  aura_one_sided: z.object({
    pool: z.array(zEthPool),
  }),
}

export const gno = {
  aura_proportional: z.object({
    pool: z.array(zGnoPool),
  }),

  aura_one_sided: z.object({
    pool: z.array(zGnoPool),
  }),
}
