import {
  NotFoundError,
  ProtocolActions,
  decodeBytes32String,
} from "defi-presets"
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { ChainPrefix, sdks } from "../sdk"
import { docParams, queryBase, transactionsJson } from "../schema"
import { ActionHandler } from "../handle"
import { parseQuery } from "../parse"

export const registerSwap = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string
) => {
  const { schema } = sdks[chainPrefix] as any
  const querySchema = schema[protocol].swap

  registry.registerPath({
    method: "get",
    path: `/${chainPrefix}:{mod}/{role}/allow/${protocol}/swap`,
    summary: `Allow making swaps on ${protocol}`,
    tags: [protocol],
    request: {
      params: docParams,
      query: querySchema,
    },

    responses: {
      200: {
        description: "Transactions for updating role permissions",
        content: {
          "application/json": {
            schema: transactionsJson,
          },
        },
      },
    },
  })
}

export const swap: ActionHandler = async (query) => {
  const {
    mod: { chain, address },
    role,
    protocol,
  } = queryBase.parse(query)

  const sdk = sdks[chain]
  const { allow, schema } = sdk

  if (!(protocol in schema) || !(protocol in allow)) {
    throw new NotFoundError(`${protocol} is not supported on ${chain}`)
  }

  const allowSwap = (allow as any)[protocol].swap as
    | ProtocolActions["swap"]
    | undefined
  const swapParams = (schema as any)[protocol].swap as any

  if (!allowSwap || !swapParams) {
    throw new NotFoundError(`${protocol} is not supported on ${chain}`)
  }

  const entries = allowSwap(parseQuery(query, swapParams))

  const calls = await sdk.apply(role, entries, {
    address,
    mode: "extend",
  })

  return sdk.exportJson(address, calls, {
    name: `Extend permissions of "${decodeBytes32String(role)}" role`,
    description: `Allow making swaps on ${protocol}`,
  })
}
