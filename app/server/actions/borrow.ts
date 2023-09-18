import { decodeBytes32String } from "defi-kit"
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { coercePermission } from "zodiac-roles-sdk"
import { ChainPrefix, queryPermissionSet, sdks } from "../sdk"
import {
  docParams,
  permission,
  permissionsQueryBase,
  transactionsJson,
  transactionsQueryBase,
} from "../schema"
import { PermissionsHandler, TransactionsHandler } from "../handle"

export const allowBorrow: TransactionsHandler = async (query) => {
  const {
    mod: { address, chain },
    role,
    protocol,
  } = transactionsQueryBase.parse(query)
  const permissions = queryPermissionSet({
    action: "borrow",
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
    description: `Allow borrowing the specified \`tokens\` on ${protocol}`,
  })
}

export const registerAllowBorrow = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string
) => {
  const { schema } = sdks[chainPrefix] as any
  const querySchema = schema[protocol].borrow

  registry.registerPath({
    method: "get",
    path: `/${chainPrefix}:{mod}/{role}/allow/${protocol}/borrow`,
    summary: `Transactions for granting permissions to borrow the specified tokens`,
    tags: [`${protocol} allow`],
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

export const borrowPermissions: PermissionsHandler = async (query) => {
  const permissions = queryPermissionSet({
    action: "borrow",
    ...permissionsQueryBase.parse(query),
    query,
  })
  return permissions.map(coercePermission)
}

export const registerBorrowPermissions = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string
) => {
  const { schema } = sdks[chainPrefix] as any
  const querySchema = schema[protocol].borrow

  registry.registerPath({
    method: "get",
    path: `/permissions/${chainPrefix}/${protocol}/borrow`,
    summary: `Permissions to borrow the specified tokens`,
    tags: [`${protocol} permissions`],
    request: {
      params: docParams,
      query: querySchema,
    },

    responses: {
      200: {
        description: "Permissions for borrowing the specified tokens",
        content: {
          "application/json": {
            schema: permission.array(),
          },
        },
      },
    },
  })
}
