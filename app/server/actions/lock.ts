import { decodeBytes32String } from "defi-kit"
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { coercePermission } from "zodiac-roles-sdk"
import { ChainPrefix, queryActionPermissionSet, sdks } from "../sdk"
import {
  transactionsDocParams,
  permission,
  actionPermissionsQueryBase,
  transactionsJson,
  actionTransactionsQueryBase,
} from "../schema"
import { PermissionsHandler, TransactionsHandler } from "../handle"

export const allowLock: TransactionsHandler = async (query) => {
  const {
    mod: { address, chain },
    role,
    protocol,
  } = actionTransactionsQueryBase.parse(query)
  const permissions = await queryActionPermissionSet({
    action: "lock",
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
    description: `Allow locking to the ${protocol} \`targets\``,
  })
}

export const registerAllowLock = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string
) => {
  const { schema } = sdks[chainPrefix] as any
  const querySchema = schema[protocol]?.lock
  
  if (!querySchema) return

  registry.registerPath({
    method: "get",
    path: `/${chainPrefix}:{mod}/{role}/allow/${protocol}/lock`,
    summary: `Allow locking to the specified ${protocol} targets`,
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

export const lockPermissions: PermissionsHandler = async (query) => {
  const permissions = await queryActionPermissionSet({
    action: "lock",
    ...actionPermissionsQueryBase.parse(query),
    query,
  })
  return permissions.map(coercePermission)
}

export const registerLockPermissions = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string
) => {
  const { schema } = sdks[chainPrefix] as any
  const querySchema = schema[protocol]?.lock
  
  if (!querySchema) return

  registry.registerPath({
    method: "get",
    path: `/permissions/${chainPrefix}/${protocol}/lock`,
    summary: `Lock to the specified ${protocol} \`targets\``,
    tags: [`${protocol} permissions`],
    request: {
      query: querySchema,
    },

    responses: {
      200: {
        description: `Permissions for locking to the ${protocol} targets`,
        content: {
          "application/json": {
            schema: permission.array(),
          },
        },
      },
    },
  })
}
