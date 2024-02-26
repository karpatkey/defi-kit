import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { ethProvider } from "../../provider"
import { getProvider } from "../../../test/provider"
import { utils } from "ethers"

const sdk = getMainnetSdk(
  process.env.NODE_ENV === "test" ? getProvider() : ethProvider
)

export const queryDepositPool = async () => {
  const deposit_pool_key = utils.keccak256(
    utils.solidityPack(
      ["string", "string"],
      ["contract.address", "rocketDepositPool"]
    )
  )
  return (await sdk.rocket_pool.storage.getAddress(
    deposit_pool_key
  )) as `0x${string}`
}
