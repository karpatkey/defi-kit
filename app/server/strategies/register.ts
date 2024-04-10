import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { ChainPrefix, queryActionPermissionSet, sdks } from "../sdk"
import { permission, transactionsDocParams, transactionsJson } from "../schema"

export const registerAllowStrategy = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  type: string,
  category: string,
  name: string
) => {
  const { strategiesSchema } = sdks[chainPrefix] as any
  console.log({ strategiesSchema })
  const querySchema = strategiesSchema[type][category][name]

  registry.registerPath({
    method: "get",
    path: `/strategy/${chainPrefix}:{mod}/{role}/allow/${type}/${category}/${name}`,
    summary: `Transactions for granting permissions to run the '${category} / ${name}' ${type} strategy`,
    tags: [`${category} ${type} strategies`],
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
  type: string,
  category: string,
  name: string
) => {
  const { strategiesSchema } = sdks[chainPrefix] as any
  const querySchema = strategiesSchema[type][category][name]

  registry.registerPath({
    method: "get",
    path: `/strategy/permissions/${chainPrefix}/${type}/${category}/${name}`,
    summary: `Run the '${category} / ${name}' ${type} strategy`,
    tags: [`${category} ${type} strategy permissions`],
    request: {
      query: querySchema,
    },

    responses: {
      200: {
        description: `Permissions for running the '${category} / ${name}' ${type} strategy`,
        content: {
          "application/json": {
            schema: permission.array(),
          },
        },
      },
    },
  })
}
