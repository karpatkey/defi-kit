import {
  Permission,
  processPermissions,
  checkIntegrity,
  applyTargets,
  applyAnnotations,
  ChainId,
  PermissionSet,
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
    permissions: (Permission | PermissionSet)[],
    options: Options
  ) {
    const { targets, annotations } = processPermissions(permissions)
    checkIntegrity(targets)

    let rolesModCalls: `0x${string}`[] = []
    let posterCalls: `0x${string}`[] = []
    try {
      rolesModCalls = await applyTargets(roleKey, targets, {
        ...options,
        chainId,
      })

      posterCalls = await applyAnnotations(roleKey, annotations, {
        ...options,
        chainId,
      })
    } catch (e) {
      // make role not found error to NotFoundError so the API will respond with 404
      if (e instanceof Error && e.message.indexOf("not found") !== -1) {
        throw new NotFoundError(e.message)
      }

      throw e
    }

    const value = 0n as const
    return [
      ...rolesModCalls.map((data) => ({
        to: options.address,
        data,
        value,
      })),
      ...posterCalls.map((data) => ({
        to: POSTER_ADDRESS,
        data,
        value,
      })),
    ]
  }
}

// EIP-3722 Poster contract
export const POSTER_ADDRESS =
  "0x000000000000cd17345801aa8147b8D3950260FF" as const
