import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { eth } from "."
import {
  ROLES_ADDRESS,
  getAvatarWallet,
  getMemberWallet,
  getOwnerWallet,
} from "../../../test/accounts"
import {
  configurePermissions,
  rolesMod,
  test,
  testRoleKey,
} from "../../../test/helpers"
import { Status } from "../../../test/types"
import { getProvider } from "../../../test/provider"
import {
  PermissionChecker__factory,
  Roles__factory,
} from "../../../test/rolesModTypechain"

describe("lido", () => {
  describe("deposit", () => {
    beforeAll(async () => {})

    it("allows submitting ETH", async () => {
      await configurePermissions(eth.deposit())
      await expect(
        test.eth.lido.steth.submit(getAvatarWallet().address, { value: 10000 })
      ).toBeAllowed()
    })

    it("allows wrapping and unwrapping stETH", async () => {})
  })
})

const permissionsInterface = PermissionChecker__factory.createInterface()

function decodeRolesError(revertData: string) {
  console.log(permissionsInterface.errors)
  if (revertData.startsWith("0x")) {
    const rolesError =
      Object.keys(rolesMod.interface.errors).find((errSig) =>
        revertData.startsWith(rolesMod.interface.getSighash(errSig))
      ) ||
      Object.keys(permissionsInterface.errors).find((errSig) =>
        revertData.startsWith(permissionsInterface.getSighash(errSig))
      )

    if (rolesError) return rolesError
  }

  return revertData
}
