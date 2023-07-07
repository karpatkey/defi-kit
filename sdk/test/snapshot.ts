import { getProvider } from "./provider"

export const snapshot = async (): Promise<string> =>
  await getProvider().send("evm_snapshot", [])

export const revert = async (snapshotId?: string) =>
  await getProvider().send("evm_revert", [snapshotId])

const BASE_SNAPSHOT_ID = "0x0"
export const baseSnapshot = async () => {
  const snapshotId = await snapshot()
  if (snapshotId !== BASE_SNAPSHOT_ID) {
    throw new Error(
      `Expected base snapshot ID ${BASE_SNAPSHOT_ID} but got ${snapshotId}`
    )
  }
}
export const revertToBase = async () => {
  await revert(BASE_SNAPSHOT_ID)
}
