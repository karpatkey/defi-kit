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

export const allowStake: TransactionsHandler = async (query) => {
  const {
    mod: { address, chain },
    role,
    protocol,
  } = transactionsQueryBase.parse(query)
  const permissions = queryPermissionSet({
    action: "stake",
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
    description: `Allow staking to the ${protocol} \`targets\``,
  })
}

export const registerAllowStake = (
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

export const stakePermissions: PermissionsHandler = async (query) => {
  const permissions = queryPermissionSet({
    action: "stake",
    ...permissionsQueryBase.parse(query),
    query,
  })
  return permissions.map(coercePermission)
}

export const registerStakePermissions = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string
) => {
  const { schema } = sdks[chainPrefix] as any
  const querySchema = schema[protocol].stake

  registry.registerPath({
    method: "get",
    path: `/permissions/${chainPrefix}/${protocol}/stake`,
    summary: `Permissions for staking to the specified ${protocol} \`targets\``,
    tags: [`${protocol} permissions`],
    request: {
      params: docParams,
      query: querySchema,
    },

    responses: {
      200: {
        description: `Permissions for staking to the ${protocol} targets`,
        content: {
          "application/json": {
            schema: permission.array(),
          },
        },
      },
    },
  })
}
