import { NotFoundError, ProtocolActions, decodeBytes32String } from "defi-kit"
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { ChainPrefix, sdks } from "../sdk"
import { docParams, queryBase, transactionsJson } from "../schema"
import { ActionHandler } from "../handle"
import { parseQuery } from "../parse"

export const registerLock = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string
) => {
  const { schema } = sdks[chainPrefix] as any
  const querySchema = schema[protocol].lock

  registry.registerPath({
    method: "get",
    path: `/${chainPrefix}:{mod}/{role}/allow/${protocol}/lock`,
    summary: `Allow locking to the specified targets`,
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

export const lock: ActionHandler = async (query) => {
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

  const allowLock = (allow as any)[protocol].lock as
    | ProtocolActions["lock"]
    | undefined
  const lockParamsSchema = (schema as any)[protocol].lock as any

  if (!allowLock || !lockParamsSchema) {
    throw new NotFoundError(`${protocol} is not supported on ${chain}`)
  }

  const entries = allowLock(parseQuery(query, lockParamsSchema))

  const calls = await sdk.apply(role, entries, {
    address,
    mode: "extend",
  })

  return sdk.exportJson(address, calls, {
    name: `Extend permissions of "${decodeBytes32String(role)}" role`,
    description: `Allow locking to the ${protocol} \`targets\``,
  })
}
