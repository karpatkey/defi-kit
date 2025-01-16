import { decodeBytes32String } from "defi-kit"
import { coercePermission } from "zodiac-roles-sdk"
import { queryRepertoirePermissionSet, sdks } from "../sdk"
import {
  repertoirePermissionsQueryBase,
  repertoireTransactionsQueryBase,
} from "../schema"
import { PermissionsHandler, TransactionsHandler } from "../handle"

export const repertoireAllow: TransactionsHandler = async (query) => {
  const {
    mod: { address, chain },
    role,
    protocol,
    name,
  } = repertoireTransactionsQueryBase.parse(query)
  const permissions = await queryRepertoirePermissionSet({
    chain,
    protocol,
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
    description: `Allow executing ${protocol} '${name}' repertoire action`,
  })
}

export const repertoirePermissions: PermissionsHandler = async (query) => {
  const permissions = await queryRepertoirePermissionSet({
    ...repertoirePermissionsQueryBase.parse(query),
    query,
  })
  return permissions.map(coercePermission)
}
