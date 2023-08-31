import { NotFoundError, ProtocolActions, decodeBytes32String } from "defi-kit"
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { ChainPrefix, sdks } from "../sdk"
import { docParams, queryBase, transactionsJson } from "../schema"
import { ActionHandler } from "../handle"
import { parseQuery } from "../parse"

export const registerBorrow = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string
) => {
  const { schema } = sdks[chainPrefix] as any
  const querySchema = schema[protocol].borrow

  registry.registerPath({
    method: "get",
    path: `/${chainPrefix}:{mod}/{role}/allow/${protocol}/borrow`,
    summary: `Allow borrowing the specified tokens`,
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

export const borrow: ActionHandler = async (query) => {
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

  const allowBorrow = (allow as any)[protocol].borrow as
    | ProtocolActions["borrow"]
    | undefined
  const borrowParamsSchema = (schema as any)[protocol].borrow as any

  if (!allowBorrow || !borrowParamsSchema) {
    throw new NotFoundError(`${protocol} is not supported on ${chain}`)
  }

  const permissions = allowBorrow(parseQuery(query, borrowParamsSchema))

  const calls = await sdk.apply(role, permissions, {
    address,
    mode: "extend",
  })

  return sdk.exportJson(address, calls, {
    name: `Extend permissions of "${decodeBytes32String(role)}" role`,
    description: `Allow borrowing the specified \`tokens\` on ${protocol}`,
  })
}
