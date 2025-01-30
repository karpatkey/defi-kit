import { z } from "zod"

export const eth = {
  unstake_stETH: z.object({}),

  unwrap_and_unstake_wstETH: z.object({}),
}
