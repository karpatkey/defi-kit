import { z } from "zod"
import { mapError } from "../errors"
import { t } from "./trpc"

import { parseInputs } from "./utils"
import { ChainPrefix, sdks } from "./sdk"
import { schema } from "./schema"

export const makeDepositProcedure = (
  chainPrefix: ChainPrefix,
  protocol: string
) => {
  const sdk = sdks[chainPrefix]
  return t.procedure
    .meta({
      openapi: {
        method: "GET",
        path: `/${chainPrefix}:{mod}/{role}/allow/${protocol}/deposit`,
        summary: `Allow managing deposits to the \`target\` ${protocol} pool`,
        description: `Responds the calls required for configuring the role to allow making deposits and withdrawals to the ${protocol} pool specified by \`target\`.`,
        tags: [protocol],
      },
    })
    .input(
      z.object({
        mod: schema.address(),
        role: z.string(),
        target: z.string(),
      })
    )
    .output(schema.transactionsJson())
    .query(async (opts) => {
      const { roleKey, modAddress } = parseInputs(opts.input)
      try {
        const entries = sdk.allow[protocol as keyof typeof sdk.allow].deposit(
          opts.input.target as any
        )
        const calls = await sdk.apply(roleKey, entries, {
          address: modAddress,
          mode: "extend",
        })
        return sdk.exportJson(modAddress, calls, {
          name: `Extend permissions of "${opts.input.role}" role`,
          description: "",
        })
      } catch (e) {
        throw mapError(e)
      }
    })
}
