import { NotFoundError, ProtocolActions, decodeBytes32String } from "defi-kit"
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { ChainPrefix, sdks } from "../sdk"
import { docParams, queryBase, transactionsJson } from "../schema"
import { ActionHandler } from "../handle"
import { parseQuery } from "../parse"

export const registerStake = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string
) => {
  const { schema } = sdks[chainPrefix] as any
  const querySchema = schema[protocol].stake

  registry.registerPath({
    method: "get",
    path: `/${chainPrefix}:{mod}/{role}/allow/${protocol}/stake`,
    summary: `Allow staking to the specified targets`,
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

export const stake: ActionHandler = async (query) => {
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

  const allowStake = (allow as any)[protocol].stake as
    | ProtocolActions["stake"]
    | undefined
  const stakeParamsSchema = (schema as any)[protocol].stake as any

  if (!allowStake || !stakeParamsSchema) {
    throw new NotFoundError(`${protocol} is not supported on ${chain}`)
  }

  const permissions = allowStake(parseQuery(query, stakeParamsSchema))

  const calls = await sdk.apply(role, permissions, {
    address,
    mode: "extend",
  })

  return sdk.exportJson(address, calls, {
    name: `Extend permissions of "${decodeBytes32String(role)}" role`,
    description: `Allow staking to the ${protocol} \`targets\``,
  })
}
