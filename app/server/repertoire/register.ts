import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { ChainPrefix, sdks } from "../sdk"
import { permission, transactionsDocParams, transactionsJson } from "../schema"

export const registerRepertoireAllow = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string,
  name: string
) => {
  const { repertoire } = sdks[chainPrefix] as any
  const querySchema = repertoire.schema[protocol][name]

  registry.registerPath({
    method: "get",
    path: `/repertoire/${chainPrefix}:{mod}/{role}/allow/${protocol}/${name}`,
    summary: `Transactions for granting permissions to run the ${protocol} '${name}' repertoire action`,
    tags: [`${protocol} repertoire actions`],
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

export const registerRepertoirePermissions = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string,
  name: string
) => {
  const { repertoire } = sdks[chainPrefix] as any
  const querySchema = repertoire.schema[protocol][name]

  registry.registerPath({
    method: "get",
    path: `/repertoire/permissions/${chainPrefix}/${protocol}/${name}`,
    summary: `Permissions for running the ${protocol} '${name}' repertoire action`,
    tags: [`${protocol} repertoire action permissions`],
    request: {
      query: querySchema,
    },

    responses: {
      200: {
        description: `Permissions for running the ${protocol} '${name}' repertoire action`,
        content: {
          "application/json": {
            schema: permission.array(),
          },
        },
      },
    },
  })
}
