import { z } from "zod"
import { mapError } from "../errors"
import { t } from "./trpc"

import { parseInputs } from "./utils"
import { ChainPrefix, sdks } from "./sdk"
import { schema } from "./schema"

export const makeSwapProcedure = (
  chainPrefix: ChainPrefix,
  protocol: string
) => {
  const sdk = sdks[chainPrefix]
  return t.procedure
    .meta({
      openapi: {
        method: "GET",
        path: `/${chainPrefix}:{mod}/{role}/allow/${protocol}/swap`,
        summary: `Allow swapping tokens via ${protocol}`,
        description: `Responds the calls required for configuring the role to allow making swaps using ${protocol}.`,
        tags: [protocol],
      },
    })
    .input(
      z.object({
        mod: schema.address(),
        role: z.string(),
        sell: z.string().optional(),
        buy: z.string().optional(),
      })
    )
    .output(schema.transactionsJson())
    .query(async (opts) => {
      const { roleKey, modAddress } = parseInputs(opts.input)
      try {
        // if (!(protocol in sdk.allow)) throw new Error("invariant violation")
        // if (!("swap" in sdk.allow[protocol as keyof typeof sdk.allow]))
        //   throw new Error("invariant violation")
        const swap = (sdk.allow as any)[protocol].swap
        const entries = swap(
          opts.input.sell && [opts.input.sell],
          opts.input.buy && [opts.input.buy]
        )

        const calls = await sdk.apply(roleKey, entries, {
          address: modAddress,
          mode: "extend",
        })
        return sdk.exportJson(modAddress, calls, {
          name: `Extend permissions of "${opts.input.role}" role`,
          description: `Allow swapping tokens via ${protocol}`,
        })
      } catch (e) {
        throw mapError(e)
      }
    })
}
