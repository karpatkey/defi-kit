import {
  Permission,
  processPermissions as processPermissionsBase,
  checkIntegrity,
  applyTargets,
  Target,
  ChainId,
} from "zodiac-roles-sdk"
import { NotFoundError } from "./errors"

type Options = (
  | {
      /** Address of the Roles mod */
      address: string
    }
  | {
      /** The targets that are currently set on the role */
      currentTargets: Target[]
    }
) & {
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
   * @param roleKey The role key of the role to apply the permissions to
   * @param permissions The permissions to apply
   */
  return async function apply(
    roleKey: string,
    permissions: Permission[],
    options: Options
  ) {
    const targets = processPermissionsBase(permissions)
    checkIntegrity(targets)

    try {
      return await applyTargets(
        roleKey,
        targets,
        "address" in options ? { ...options, chainId } : options
      )
    } catch (e) {
      // make role not found error to NotFoundError so the API will respond with 404
      if (e instanceof Error && e.message.indexOf("not found") !== -1) {
        throw new NotFoundError(e.message)
      }

      throw e
    }
  }
}
