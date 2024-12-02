import { getAddress } from "ethers"
import { z } from "zod"
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"

// zx = "zod extension", providing custom zod types

extendZodWithOpenApi(z)

export const zx = {
  address: () =>
    z
      .string()
      .regex(/0x[a-fA-F0-9]{40}/)
      .transform((val, ctx) => {
        try {
          return getAddress(val) as `0x${string}`
        } catch (e) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Address checksum is invalid",
          })
          return z.NEVER
        }
      }),
}
