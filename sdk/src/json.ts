import { Interface, Result } from "ethers/lib/utils"
import { ChainId, rolesAbi } from "zodiac-roles-sdk"

export const createExportJson = (chainId: ChainId) => {
  /**
   * Exports calls as a JSON object that can be imported into the Safe Transaction Builder app.
   * @param address The address of the Roles mod that shall be configured
   * @param calls The call data to the Roles mod
   * @param meta Meta info to set on the JSON file
   * @returns The Safe Transaction Builder compatible JSON object
   */
  return function exportJson(
    address: `0x${string}`,
    calls: string[],
    meta?: {
      name?: string
      description?: string
      /** Set to true to include ABI information. This allows the Safe Transaction Builder to show the decoded call data. */
      includeAbi?: string
    }
  ) {
    const transactions = calls.map((data) => ({
      to: address,
      value: "0",
      data,
      ...(meta?.includeAbi ? getAbiInfo(data) : {}),
    }))

    return {
      version: "1.0",
      chainId: chainId.toString(10),
      createdAt: Date.now(),
      meta: {
        name: meta?.name || "Update role permissions",
        description: meta?.description || "",
        txBuilderVersion: "1.16.2",
      },
      transactions,
    } as const
  }
}

const rolesInterface = new Interface(rolesAbi)

const getAbiInfo = (data: string) => {
  const selector = data.slice(0, 10)
  const functionFragment = rolesInterface.getFunction(selector)

  if (!functionFragment) {
    throw new Error(`Could not find a Roles function with selector ${selector}`)
  }

  const contractMethod = rolesAbi.find(
    (fragment) =>
      fragment.type === "function" && fragment.name === functionFragment.name
  )
  if (!contractMethod) {
    throw new Error(
      `Could not find an ABI function fragment with name ${functionFragment.name}`
    )
  }

  const contractInputsValues = asObject(
    rolesInterface.decodeFunctionData(functionFragment, data)
  )

  return {
    contractMethod,
    contractInputsValues,
  }
}

const asObject = (result: Result) => {
  const object: Record<string, any> = {}
  for (const key of Object.keys(result)) {
    if (isNaN(Number(key))) continue // skip numeric keys (array indices)
    object[key] = result[key]
  }
  return object
}

export interface ContractMethod {
  inputs: ContractInput[]
  name: string
  payable: boolean
}

export interface ContractInput {
  internalType: string
  name: string
  type: string
  components?: ContractInput[]
}
