import { Chain } from "../src"
import { getProvider } from "./provider"

export const snapshot = async (chainId: Chain): Promise<string> =>
  await getProvider(chainId).send("evm_snapshot", [])

export const revert = async (chainId: Chain, snapshotId?: string) =>
  await getProvider(chainId).send("evm_revert", [snapshotId])

const BASE_SNAPSHOT_ID = "0x0"
export const baseSnapshot = async (chainId: Chain) => {
  const snapshotId = await snapshot(chainId)
  if (snapshotId !== BASE_SNAPSHOT_ID) {
    throw new Error(
      `Expected base snapshot ID ${BASE_SNAPSHOT_ID} but got ${snapshotId}`
    )
  }
}

const revertToBase = async (chainId: Chain) => {
  await revert(chainId, BASE_SNAPSHOT_ID)
}

export const revertAllToBase = async () => {
  await Promise.all(Object.values(Chain).map(revertToBase))
}