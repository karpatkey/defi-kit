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

export const allowDeposit: TransactionsHandler = async (query) => {
  const {
    mod: { address, chain },
    role,
    protocol,
  } = actionTransactionsQueryBase.parse(query)
  const permissions = await queryActionPermissionSet({
    action: "deposit",
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
    description: `Allow managing deposits to the \`target\` ${protocol} pool`,
  })
}

export const registerAllowDeposit = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string
) => {
  const { schema } = sdks[chainPrefix] as any
  const querySchema = schema[protocol].deposit

  registry.registerPath({
    method: "get",
    path: `/${chainPrefix}:{mod}/{role}/allow/${protocol}/deposit`,
    summary: `Allow managing deposits to the target ${protocol} pools`,
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

export const depositPermissions: PermissionsHandler = async (query) => {
  const permissions = await queryActionPermissionSet({
    action: "deposit",
    ...actionPermissionsQueryBase.parse(query),
    query,
  })
  return permissions.map(coercePermission)
}

export const registerDepositPermissions = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string
) => {
  const { schema } = sdks[chainPrefix] as any
  const querySchema = schema[protocol].deposit

  registry.registerPath({
    method: "get",
    path: `/permissions/${chainPrefix}/${protocol}/deposit`,
    summary: `Manage deposits to the ${protocol} \`targets\``,
    tags: [`${protocol} permissions`],
    request: {
      query: querySchema,
    },

    responses: {
      200: {
        description: `Permissions for managing deposits to the ${protocol} \`targets\``,
        content: {
          "application/json": {
            schema: permission.array(),
          },
        },
      },
    },
  })
}
