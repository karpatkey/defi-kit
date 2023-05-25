import zod from "zod"
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"

extendZodWithOpenApi(zod)

const ADDRESS = /^0x[0-9a-fA-F]{40}$/

export const z = {
  ...zod,

  address: () =>
    z
      .string()
      .regex(ADDRESS)
      .openapi({ example: "0x0000000000000000000000000000000000000000" }),

  transactionsJson: () =>
    z.object({
      version: z.string(),
      chainId: z.string(),
      meta: z.object({
        name: z.string(),
        description: z.string(),
        txBuilderVersion: z.string(),
      }),
      createdAt: z.number(),
      transactions: z.array(
        z.object({
          to: z.string(),
          data: z.string(),
          value: z.string(),
        })
      ),
    }),
}
