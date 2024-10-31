import {
  Interface,
  JsonFragment,
  JsonFragmentType,
  ParamType,
  Result,
  hexlify,
  isBytesLike,
} from "ethers"
import { ChainId, posterAbi, rolesAbi } from "zodiac-roles-sdk"
import { POSTER_ADDRESS } from "./apply"

export const createExportToSafeTransactionBuilder = (chainId: ChainId) => {
  /**
   * Exports calls as a JSON object that can be imported into the Safe Transaction Builder app.
   * @param transactions The transactions to export
   * @param meta Meta info to set on the JSON file
   * @returns The Safe Transaction Builder compatible JSON object
   */
  return function exportToSafeTransactionBuilder(
    transactions: {
      to: `0x${string}`
      data: `0x${string}`
      value: "0"
    }[],
    meta?: {
      name?: string
      description?: string
    }
  ) {
    return {
      version: "1.0",
      chainId: chainId.toString(10),
      createdAt: Date.now(),
      meta: {
        name: meta?.name || "Update role permissions",
        description: meta?.description || "",
        txBuilderVersion: "1.16.2",
      },
      transactions: transactions.map(decode),
    } as const
  }
}

const decode = (transaction: {
  to: `0x${string}`
  data: `0x${string}`
  value: "0"
}) => {
  const abi: readonly JsonFragment[] =
    transaction.to === POSTER_ADDRESS ? posterAbi : rolesAbi
  const iface = new Interface(abi)

  const selector = transaction.data.slice(0, 10)
  const functionFragment = iface.getFunction(selector)

  if (!functionFragment) {
    throw new Error(`Could not find a function with selector ${selector}`)
  }

  const contractMethod = abi.find(
    (fragment) =>
      fragment.type === "function" && fragment.name === functionFragment.name
  )
  if (!contractMethod) {
    throw new Error(
      `Could not find an ABI function fragment with name ${functionFragment.name}`
    )
  }

  const contractInputsValues = asTxBuilderInputValues(
    iface.decodeFunctionData(functionFragment, transaction.data),
    functionFragment.inputs
  )

  return {
    to: transaction.to,
    value: transaction.value,
    contractMethod: {
      inputs: mapInputs(contractMethod.inputs) || [],
      name: contractMethod.name || "",
      payable: !!contractMethod.payable,
    },
    contractInputsValues,
  }
}

const mapInputs = (
  inputs: readonly JsonFragmentType[] | undefined
): ContractInput[] | undefined => {
  return inputs?.map((input) => ({
    internalType: input.internalType || "",
    name: input.name || "",
    type: input.type || "",
    components: mapInputs(input.components),
  }))
}

const asTxBuilderInputValues = (
  result: Result,
  params: readonly ParamType[]
) => {
  const object: Record<string, string> = {}

  for (const param of params) {
    const value = result[param.name]
    let serialized = value
    if (typeof value === "string") {
      serialized = value
    } else if (typeof value === "bigint" || typeof value === "number") {
      serialized = value.toString()
    } else if (isBytesLike(value)) {
      serialized = hexlify(value)
    } else if (value instanceof Result) {
      serialized = JSON.stringify(value, (_, v) =>
        isBytesLike(v) ? hexlify(v) : typeof v === "bigint" ? v.toString() : v
      )
    } else {
      throw new Error(`Unexpected value type: ${typeof value}`)
    }

    object[param.name] = serialized
  }
  return object
}

export interface ContractInput {
  internalType: string
  name: string
  type: string
  components?: ContractInput[]
}
