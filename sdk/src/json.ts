interface Options {
  chainId: number
  /** Address of the Roles mod */
  address: `0x${string}`
}

/**
 * Exports calls to as a JSON file that can be imported into the Safe Transaction Builder app.
 * @param calls The call data to the Roles mod
 * @param options Options for the JSON file
 * @returns
 */
export const exportJson = (
  calls: string[],
  options: Options,
  meta?: {
    name: string
    description: string
    txBuilderVersion: string
  }
) => {
  const transactions = calls.map((data) => ({
    to: options.address,
    data,
    value: "0",
  }))

  return {
    version: "1.0",
    chainId: options.chainId.toString(10),
    meta: {
      name: meta?.name || "Update role permissions",
      description: meta?.description || "",
      txBuilderVersion: meta?.txBuilderVersion || "1.13.3",
    },
    createdAt: Date.now(),
    transactions,
  } as const
}
