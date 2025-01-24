import { Chain } from "../src"
import { getProvider } from "./provider"

export const snapshot = async (chain: Chain): Promise<string> =>
  await getProvider(chain).send("evm_snapshot", [])

export const revert = async (chain: Chain, snapshotId?: string) =>
  await getProvider(chain).send("evm_revert", [snapshotId])

const BASE_SNAPSHOT_ID = "0x0"
export const baseSnapshot = async (chain: Chain) => {
  const snapshotId = await snapshot(chain)
  if (snapshotId !== BASE_SNAPSHOT_ID) {
    throw new Error(
      `Expected base snapshot ID ${BASE_SNAPSHOT_ID} but got ${snapshotId}`
    )
  }
}

const revertToBase = async (chain: Chain) => {
  await revert(chain, BASE_SNAPSHOT_ID)
}

export const revertAllToBase = async () => {
  await Promise.all(Object.values(Chain).map(revertToBase))
}
