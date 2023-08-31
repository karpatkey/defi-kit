import { Permission } from "zodiac-roles-sdk"
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { BaseContract } from "ethers"
import { Roles__factory } from "./rolesModTypechain"
import { ROLES_ADDRESS, getMemberWallet, getOwnerWallet } from "./accounts"
import { encodeBytes32String } from "../src"
import { getProvider } from "./provider"
import { createApply } from "../src/apply"

const owner = getOwnerWallet()

export const rolesMod = Roles__factory.connect(ROLES_ADDRESS, owner)
export const testRoleKey = encodeBytes32String("TEST-ROLE")

export const applyPermissions = async (permissions: Permission[]) => {
  const apply = createApply(1) // chainId here won't matter since we pass currentTargets
  const calls = await apply(testRoleKey, permissions, {
    address: rolesMod.address,
    currentTargets: [],
    mode: "replace",
    log: console.debug,
  })

  console.log(`Applying permissions with ${calls.length} calls`)
  let nonce = await owner.getTransactionCount()
  await Promise.all(
    calls.map((call) =>
      owner.sendTransaction({
        to: rolesMod.address,
        data: call,
        nonce: nonce++,
      })
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
  const execThroughRole = rolesMod.connect(getMemberWallet()).callStatic
    .execTransactionWithRole

  return Object.fromEntries(
    Object.keys(contract.functions).map((name) => [
      name,
      async function testCallThroughRolesMod(...args: any[]) {
        const res = Object.entries(contract.interface.functions).find(
          ([signature, fragment]) =>
            signature === name || signature.startsWith(name + "(")
        )
        if (!res) throw new Error(`Function ${name} not found`)
        const fragment = res[1]

        const options = args[fragment.inputs.length] || {}
        const data = contract.interface.encodeFunctionData(
          name,
          args.slice(0, fragment.inputs.length)
        )
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
