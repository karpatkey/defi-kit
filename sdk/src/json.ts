import { ChainId } from "zodiac-roles-sdk"

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
      name: string
      description: string
    }
  ) {
    const transactions = calls.map((data) => ({
      to: address,
      data,
      value: "0",
    }))

    return {
      version: "1.0",
      chainId: chainId.toString(10),
      meta: {
        name: meta?.name || "Update role permissions",
        description: meta?.description || "",
        txBuilderVersion: "1.13.3",
      },
      createdAt: Date.now(),
      transactions,
    } as const
  }
}
