import {
  Permission,
  processPermissions,
  targetIntegrity,
  planApplyRole,
  ChainId,
  PermissionSet,
  Target,
  Annotation,
  fetchRole,
} from "zodiac-roles-sdk"
import { NotFoundError } from "./errors"

type Options = {
  address: `0x${string}`

  /**  The mode to use for updating the permissions of the role:
   *  - "replace": The role will have only the passed permissions, meaning that all other currently configured permissions will be revoked from the role
   *  - "extend": The role will keep its current permissions and will additionally be granted the passed permissions
   *  - "remove": All passed permissions will be revoked from the role
   */
  mode: "replace" | "extend" | "remove"
  log?: boolean | ((message: string) => void)

  currentTargets?: Target[]
  currentAnnotations?: Annotation[]
}

export const createApply = (chainId: ChainId) => {
  /**
   * Applies the passed permissions to the role.
   * @param address The address of the Roles mod that shall be configured
   * @param roleKey The bytes32 role key of the role to apply the permissions to
   * @param permissions The permissions to apply
   */
  return async function apply(
    roleKey: `0x${string}`,
    permissions: (Permission | PermissionSet | Promise<PermissionSet>)[],
    options: Options
  ) {
    const awaitedPermissions = await Promise.all(permissions)
    const { targets, annotations } = processPermissions(awaitedPermissions)
    targetIntegrity(targets)

    const role = await fetchRole({ address: options.address, roleKey, chainId })
    if (!role && options.mode === "remove") {
      throw new NotFoundError(
        `Role ${roleKey} not found on mod at address ${options.address}`
      )
    }

    return await planApplyRole(
      { key: roleKey, targets, annotations },
      {
        ...options,
        chainId,
        current: {
          key: roleKey,
          members: role?.members || [],
          lastUpdate: role?.lastUpdate || 0,
          targets: options.currentTargets || role?.targets || [],
          annotations: options.currentAnnotations || role?.annotations || [],
        },
      }
    )
  }
}

// EIP-3722 Poster contract
export const POSTER_ADDRESS =
  "0x000000000000cd17345801aa8147b8D3950260FF" as const
