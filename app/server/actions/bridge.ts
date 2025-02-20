import { decodeBytes32String } from "defi-kit"
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { coercePermission } from "zodiac-roles-sdk"
import { ChainPrefix, queryActionPermissionSet, sdks } from "../sdk"
import {
  permission,
  actionPermissionsQueryBase,
  transactionsDocParams,
  transactionsJson,
  actionTransactionsQueryBase,
} from "../schema"
import { PermissionsHandler, TransactionsHandler } from "../handle"

export const allowBridge: TransactionsHandler = async (query) => {
  const {
    mod: { address, chain },
    role,
    protocol,
  } = actionTransactionsQueryBase.parse(query)
  const permissions = await queryActionPermissionSet({
    action: "bridge",
    chain,
    protocol,
    query,
  })

  const { apply, exportToSafeTransactionBuilder } = sdks[chain]
  const calls = await apply(role, permissions, {
    address,
    mode: "extend",
  })

  return exportToSafeTransactionBuilder(calls, {
    name: `Extend permissions of "${decodeBytes32String(role)}" role`,
    description: `Allow bridging the specified \`tokens\` on ${protocol}`,
  })
}

export const registerAllowBridge = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string
) => {
  const { schema } = sdks[chainPrefix] as any
  const querySchema = schema[protocol].bridge

  registry.registerPath({
    method: "get",
    path: `/${chainPrefix}:{mod}/{role}/allow/${protocol}/bridge`,
    summary: `Transactions for granting permissions to bridge the specified tokens`,
    tags: [`${protocol} allow`],
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

export const bridgePermissions: PermissionsHandler = async (query) => {
  const permissions = await queryActionPermissionSet({
    action: "bridge",
    ...actionPermissionsQueryBase.parse(query),
    query,
  })
  return permissions.map(coercePermission)
}

export const registerBridgePermissions = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string
) => {
  const { schema } = sdks[chainPrefix] as any
  const querySchema = schema[protocol].bridge

  registry.registerPath({
    method: "get",
    path: `/permissions/${chainPrefix}/${protocol}/bridge`,
    summary: `Bridge the specified tokens on ${protocol}`,
    tags: [`${protocol} permissions`],
    request: {
      query: querySchema,
    },

    responses: {
      200: {
        description: "Permissions for bridging the specified tokens",
        content: {
          "application/json": {
            schema: permission.array(),
          },
        },
      },
    },
  })
}
