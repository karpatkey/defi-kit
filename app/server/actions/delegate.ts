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

export const allowDelegate: TransactionsHandler = async (query) => {
  const {
    mod: { address, chain },
    role,
    protocol,
  } = actionTransactionsQueryBase.parse(query)
  const permissions = await queryActionPermissionSet({
    action: "delegate",
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
    description: `Allow delegation of the ${protocol} \`targets\``,
  })
}

export const registerAllowDelegate = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string
) => {
  const { schema } = sdks[chainPrefix] as any
  const querySchema = schema[protocol]?.delegate

  if (!querySchema) return

  registry.registerPath({
    method: "get",
    path: `/${chainPrefix}:{mod}/{role}/allow/${protocol}/delegate`,
    summary: `Allow delegation of the specified targets`,
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

export const delegatePermissions: PermissionsHandler = async (query) => {
  const permissions = await queryActionPermissionSet({
    action: "delegate",
    ...actionPermissionsQueryBase.parse(query),
    query,
  })
  return permissions.map(coercePermission)
}

export const registerDelegatePermissions = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string
) => {
  const { schema } = sdks[chainPrefix] as any
  const querySchema = schema[protocol]?.delegate

  if (!querySchema) return

  registry.registerPath({
    method: "get",
    path: `/permissions/${chainPrefix}/${protocol}/delegate`,
    summary: `Manage delegates for the ${protocol} \`targets\``,
    tags: [`${protocol} permissions`],
    request: {
      query: querySchema,
    },

    responses: {
      200: {
        description: `Permissions for managing delegates for the ${protocol} \`targets\``,
        content: {
          "application/json": {
            schema: permission.array(),
          },
        },
      },
    },
  })
}
