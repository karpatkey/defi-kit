import { z } from "zod"
import { zEthPool, zGnoPool } from "../../../protocols/aura/schema"

export const eth = {
  bpt: z.object({
    pool: z.array(zEthPool),
  }),

  underlying_single: z.object({
    pool: z.array(zEthPool),
  }),
}

export const gno = {
  bpt: z.object({
    pool: z.array(zGnoPool),
  }),

  underlying_single: z.object({
    pool: z.array(zGnoPool),
  }),
}
