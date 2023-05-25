import { getAddress } from "ethers/lib/utils"
import { z } from "zod"

// zx = "zod extension", providing custom zod types

const ADDRESS = /^0x[0-9a-fA-F]{40}$/

export const zx = {
  address: () =>
    z
      .custom<`0x${string}`>((val) => ADDRESS.test(val as string))
      .transform((val, ctx) => {
        try {
          return getAddress(val)
        } catch (e) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Address checksum is invalid",
          })
          return z.NEVER
        }
      }),
}
