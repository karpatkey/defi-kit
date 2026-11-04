import { Chain } from "../src"
import { getProvider } from "./provider"
import { activeChains } from "./chains"

export const snapshot = async (chain: Chain): Promise<string> =>
  await getProvider(chain).send("evm_snapshot", [])

export const revert = async (chain: Chain, snapshotId?: string) =>
  await getProvider(chain).send("evm_revert", [snapshotId])

const BASE_SNAPSHOT_ID = "0x0"
export const baseSnapshot = async (chain: Chain) => {
  const snapshotId = await snapshot(chain)
  if (snapshotId !== BASE_SNAPSHOT_ID) {
    throw new Error(
      `Error taking base snapshot on ${chain} fork: expected base snapshot ID ${BASE_SNAPSHOT_ID} but got ${snapshotId}`
    )
  }
  console.log("Base snapshot taken on", chain)
}

const revertToBase = async (chain: Chain) => {
  await revert(chain, BASE_SNAPSHOT_ID)
}

export const revertAllToBase = async () => {
  // Only the chains this run started forks for: setup-after-env registers this
  // as a global afterAll, so it runs after every test file -- including the
  // ones the shard filtered to empty. Reverting a chain with no fork behind it
  // makes ethers retry "failed to detect network" forever and hangs the job.
  await Promise.all(activeChains().map(revertToBase))
}
