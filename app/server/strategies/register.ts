import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { ChainPrefix, queryActionPermissionSet, sdks } from "../sdk"
import { permission, transactionsDocParams, transactionsJson } from "../schema"

export const registerAllowStrategy = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string,
  name: string
) => {
  const { strategiesSchema } = sdks[chainPrefix] as any
  console.log({ strategiesSchema })
  const querySchema = strategiesSchema[protocol][name]

  registry.registerPath({
    method: "get",
    path: `/strategy/${chainPrefix}:{mod}/{role}/allow/${protocol}/${name}`,
    summary: `Transactions for granting permissions to run the '${protocol} / ${name}' strategy`,
    tags: [`${protocol} ${name} strategies`],
    request: {
      params: transactionsDocParams,
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

export const registerStrategyPermissions = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string,
  name: string
) => {
  const { strategiesSchema } = sdks[chainPrefix] as any
  const querySchema = strategiesSchema[protocol][name]

  registry.registerPath({
    method: "get",
    path: `/strategy/permissions/${chainPrefix}/${protocol}/${name}`,
    summary: `Run the '${protocol} / ${name}' strategy`,
    tags: [`${protocol} ${name} strategy permissions`],
    request: {
      query: querySchema,
    },

    responses: {
      200: {
        description: `Permissions for running the '${protocol} / ${name}' strategy`,
        content: {
          "application/json": {
            schema: permission.array(),
          },
        },
      },
    },
  })
}
