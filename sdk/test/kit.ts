import { getMainnetSdk } from "@gnosis-guild/eth-sdk-client"
import {
  Addressable,
  BaseContract,
  ContractTransaction,
  ContractTransactionResponse,
  FunctionFragment,
  isError,
  toBeHex,
} from "ethers"
import { avatar } from "./wallets"
import { execThroughRole } from "./helpers"
import { getRolesMod } from "./rolesMod"
import { ContractFactories, KnownContracts } from "@gnosis-guild/zodiac"

/** We need to skip over functions with "view" state mutability. We do this by matching the ethers ContractMethod type  */
interface StateMutatingContractMethod {
  (): Promise<ContractTransactionResponse>
  name: string
  fragment: FunctionFragment
  getFragment(): FunctionFragment
  populateTransaction(): Promise<ContractTransaction>
  staticCall(): Promise<any>
  send(): Promise<ContractTransactionResponse>
  estimateGas(): Promise<bigint>
  staticCallResult(): Promise<any>
}

type TestContract<C extends BaseContract> = {
  [key in Exclude<
    keyof C,
    "attach"
  >]: C[key] extends StateMutatingContractMethod
    ? C[key] & { delegateCall: C[key]["send"] }
    : C[key]
} & { attach(target: string | Addressable): C }

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

const makeTestContract = <C extends BaseContract>(
  contract: C
): TestContract<C> => {
  const rolesInterface =
    ContractFactories[KnownContracts.ROLES_V2].createInterface()

  const isWriteFunction = (prop: string) => {
    try {
      const func = contract.getFunction(prop)
      return (
        func.fragment.stateMutability === "nonpayable" ||
        func.fragment.stateMutability === "payable"
      )
    } catch (error) {
      if (!isError(error, "INVALID_ARGUMENT") || error.argument !== "key") {
        throw error
      }
      return false
    }
  }

  return new Proxy(contract, {
    get: (target, prop) => {
      if (prop === "attach") {
        return (addr: string | Addressable) =>
          makeTestContract(target.attach(addr))
      }

      if (typeof prop === "string" && isWriteFunction(prop)) {
        const original = (target as any)[prop] as StateMutatingContractMethod

        const throughRoles =
          (operation: 1 | 0 = 0) =>
          async (...args: any[]) => {
            let overrides = undefined
            if (args.length > original.fragment.inputs.length) {
              overrides = args.pop()
            }
            const { value, ...overridesRest } = overrides || {}

            const data = contract.interface.encodeFunctionData(
              original.fragment,
              args
            ) as `0x${string}`
            try {
              return await execThroughRole(
                {
                  to: (await contract.getAddress()) as `0x${string}`,
                  data,
                  value: value && toBeHex(BigInt(value)),
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
                contract.interface.decodeFunctionResult(
                  original.fragment,
                  rootError.data
                )
                // we should never get here
                throw new Error("invariant violation")
              }

              throw error
            }
          }

        const contractMethod = throughRoles(0) as any
        Object.assign(contractMethod, original)
        contractMethod.call = throughRoles(0)
        contractMethod.delegateCall = throughRoles(1)

        return contractMethod
      }

      return (target as any)[prop]
    },
  }) as any
}

export const testKit = {
  eth: mapSdk(getMainnetSdk(avatar)),
}
