import z from "zod"

const ADDRESS = /^0x[0-9a-fA-F]{40}$/

export const schema = {
  address: () => z.string().regex(ADDRESS),

  commaSeparatedList: (element: z.ZodString) =>
    z.string().transform((val) => val.split(",").map((v) => element.parse(v))),

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
