import { decodeBytes32String } from "defi-kit"
import { coercePermission } from "zodiac-roles-sdk"
import { queryStrategyPermissionSet, sdks } from "../sdk"
import {
  strategyPermissionsQueryBase,
  strategyTransactionsQueryBase,
} from "../schema"
import { PermissionsHandler, TransactionsHandler } from "../handle"

export const allowStrategy: TransactionsHandler = async (query) => {
  const {
    mod: { address, chain },
    role,
    type,
    category,
    name,
  } = strategyTransactionsQueryBase.parse(query)
  const permissions = await queryStrategyPermissionSet({
    chain,
    type,
    category,
    name,
    query,
  })

  const { apply, exportToSafeTransactionBuilder } = sdks[chain]
  const calls = await apply(role, permissions, {
    address,
    mode: "extend",
  })

  return exportToSafeTransactionBuilder(calls, {
    name: `Extend permissions of "${decodeBytes32String(role)}" role`,
    description: `Allow executing ${type} strategy '${category} / ${name}'`,
  })
}

export const strategyPermissions: PermissionsHandler = async (query) => {
  const permissions = await queryStrategyPermissionSet({
    ...strategyPermissionsQueryBase.parse(query),
    query,
  })
  return permissions.map(coercePermission)
}
