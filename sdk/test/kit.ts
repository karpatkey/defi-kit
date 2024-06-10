import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { BaseContract, BigNumber } from "ethers"
import { avatar } from "./wallets"
import { execThroughRole } from "./helpers"
import { getRolesMod } from "./rolesMod"

type EthSdk = {
  [key: string]: EthSdk | BaseContract
}

type TestKit<S extends EthSdk> = {
  [Key in keyof S]: S[Key] extends BaseContract
    ? TestContract<S[Key]>
    : S[Key] extends EthSdk // somehow it cannot infer that it cannot be a BaseContract here, so we use an extra conditional
    ? TestKit<S[Key]>
    : never
}

type TestContract<C extends BaseContract> = {
  /** Calls the function routed through the Roles mod */
  [Name in keyof C["functions"]]: C["functions"][Name]
} & {
  /** Calls the function with a delegate call routed through the Roles mod */
  delegateCall: { [Name in keyof C["functions"]]: C["functions"][Name] }

  /** Calls the function without state updates and returns the result. Won't be routed through the Roles mod */
  callStatic: { [Name in keyof C["functions"]]: C["functions"][Name] }

  address: `0x${string}`
  attach(address: `0x${string}`): TestContract<C>
}

const mapSdk = <S extends EthSdk>(sdk: S): TestKit<S> => {
  return Object.keys(sdk).reduce((acc, key) => {
    // for this check to work reliably, make sure ethers node_modules is not duplicated
    if (sdk[key] instanceof BaseContract) {
      acc[key] = makeTestContract(sdk[key] as BaseContract)
    } else {
      acc[key] = mapSdk(sdk[key] as EthSdk)
    }
    return acc
  }, {} as any)
}

const makeTestContract = (contract: BaseContract) => {
  const rolesInterface = getRolesMod().interface

  const testContract = {
    delegateCall: {},
    callStatic: contract.callStatic,
    address: contract.address,
    attach(address: `0x${string}`) {
      return makeTestContract(contract.attach(address))
    },
  } as TestContract<BaseContract>

  Object.entries(contract.functions).forEach(([name, fn]) => {
    // only route non-constant functions through Roles mod
    if (!contract.interface.getFunction(name).constant) {
      const throughRoles =
        (operation: 1 | 0 = 0) =>
        async (...args: any[]) => {
          let overrides = undefined
          if (
            args.length > contract.interface.getFunction(name).inputs.length
          ) {
            overrides = args.pop()
          }
          const { value, ...overridesRest } = overrides || {}

          const data = contract.interface.encodeFunctionData(
            name,
            args
          ) as `0x${string}`
          try {
            return await execThroughRole(
              {
                to: contract.address as `0x${string}`,
                data,
                value: value && BigNumber.from(value).toHexString(),
                operation: operation,
              },
              overridesRest
            )
          } catch (error: any) {
            if (typeof error !== "object") {
              throw error
            }

            // find the root cause error with errorSignature or revert data in the ethers error stack
            let rootError = error
            while (
              rootError.error &&
              !rootError.data &&
              !rootError.errorSignature
            ) {
              rootError = rootError.error
            }

            // re-throw if the error is not a revert
            if (
              !rootError.message.startsWith("execution reverted") &&
              !rootError.message.startsWith("call revert exception") &&
              !rootError.reason?.startsWith("execution reverted")
            ) {
              throw error
            }

            if (!rootError.errorSignature) {
              // Check if the error is a roles error
              const selector = rootError.data.slice(0, 10)
              let rolesError = undefined
              try {
                rolesError = rolesInterface.getError(selector)
              } catch (e) {}
              if (rolesError) {
                // Decode the revert data using Roles ABI. this will throw a better error
                rolesInterface.decodeFunctionResult(
                  "execTransactionWithRole",
                  rootError.data
                )
              }

              // Not a Roles error, try decoding the call return data, this will decode the revert reason using the target contract's ABI and throw a better error
              contract.interface.decodeFunctionResult(name, rootError.data)
              // we should never get here
              throw new Error("invariant violation")
            }

            throw error
          }
        }

      // call contract functions through roles mod
      testContract[name] = throughRoles(0)
      // delegate calls through roles mod
      testContract.delegateCall[name] = throughRoles(1)
    }
  })

  return testContract
}

export const testKit = {
  eth: mapSdk(getMainnetSdk(avatar)),
}
