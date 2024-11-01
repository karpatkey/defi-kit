import { getMainnetSdk } from "@gnosis-guild/eth-sdk-client"
import { ethProvider } from "../../provider"
import { getProvider } from "../../../test/provider"
import { keccak256, solidityPacked } from "ethers"

const sdk = getMainnetSdk(
  process.env.NODE_ENV === "test" ? getProvider() : ethProvider
)

export const queryDepositPool = async () => {
  const deposit_pool_key = keccak256(
    solidityPacked(
      ["string", "string"],
      ["contract.address", "rocketDepositPool"]
    )
  )

  // TODO: we need this as any cast because typechain does not yet correctly generate the types for conflicting function names
  // (getAddress is a BaseContract member, so the full TypeChain would have to create the function member type under the full signature key)
  return (await (sdk.rocketPool.storage as any)["getAddress(bytes32)"](
    deposit_pool_key
  )) as `0x${string}`
}
