import {
  AVATAR,
  PresetAllowEntry,
  applyPermissions,
  fillPreset,
} from "zodiac-roles-sdk"
import { Roles__factory } from "./rolesModTypechain"
import {
  ROLES_ADDRESS,
  getAvatarWallet,
  getMemberWallet,
  getOwnerWallet,
} from "./accounts"
import { encodeBytes32String } from "../src"
import { getProvider } from "./provider"
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { BaseContract } from "ethers"

const owner = getOwnerWallet()

export const rolesMod = Roles__factory.connect(ROLES_ADDRESS, owner)
export const testRoleKey = encodeBytes32String("TEST-ROLE")

const chainId = getProvider().network.chainId

export const configurePermissions = async (entries: PresetAllowEntry[]) => {
  const calls = await applyPermissions(
    testRoleKey,
    fillPreset(
      { allow: entries, chainId, placeholders: {} },
      { AVATAR: getAvatarWallet().address }
    ),
    { address: rolesMod.address, currentPermissions: [], mode: "replace" }
  )

  await Promise.all(
    calls.map((call) =>
      owner.sendTransaction({ to: rolesMod.address, data: call })
    )
  )
  console.log("Permissions applied")
}

type EthSdk = {
  [key: string]: EthSdk | BaseContract
}

type TestKit<S extends EthSdk> = {
  [Key in keyof S]: S[Key] extends BaseContract
    ? S[Key]["functions"]
    : S[Key] extends EthSdk // somehow it cannot infer that it cannot be a BaseContract here, so we use an extra conditional
    ? TestKit<S[Key]>
    : never
}

const mapSdk = <S extends EthSdk>(sdk: S): TestKit<S> => {
  return Object.keys(sdk).reduce((acc, key) => {
    // for this check to work reliably, make sure ethers node_modules is not duplicated
    if (sdk[key] instanceof BaseContract) {
      acc[key] = makeTestFunctions(sdk[key] as BaseContract)
    } else {
      acc[key] = mapSdk(sdk[key] as EthSdk)
    }
    return acc
  }, {} as any)
}

const makeTestFunctions = (contract: BaseContract) => {
  const execThroughRole = rolesMod.connect(getMemberWallet()).functions
    .execTransactionWithRole

  return Object.fromEntries(
    Object.keys(contract.functions).map((name) => [
      name,
      async function testCallThroughRolesMod(...args: any[]) {
        const options =
          args[contract.interface.functions[name].inputs.length] || {}
        const data = contract.interface.encodeFunctionData(name, args)
        return await execThroughRole(
          contract.address,
          options.value || 0,
          data,
          0,
          testRoleKey,
          false
        )
      },
    ])
  )
}

export const test = {
  eth: mapSdk(getMainnetSdk(getProvider())),
}
