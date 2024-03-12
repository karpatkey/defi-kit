import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { NotFoundError } from "../../../errors"
import { BigNumber } from "ethers"
import { ethProvider } from "../../../provider"
import { getProvider } from "../../../../test/provider"
import { EthToken } from "./types"
import ethInfo from "./_ethInfo"

const sdk = getMainnetSdk(
  process.env.NODE_ENV === "test" ? getProvider() : ethProvider
)

// /** Validates that the given `targets` are valid IDs of Uniswap v3 positions owned by the given `avatar` */
// export const validateNftIds = async (
//   avatar: `0x${string}`,
//   targets: string[]
// ) => {
//   const targetNftIds = targets.map((target) => {
//     try {
//       return BigNumber.from(target)
//     } catch (e) {
//       // could not be parsed as BigNumber
//       throw new NotFoundError(`Invalid NFT ID: ${target}`)
//     }
//   })

//   const owners = await Promise.all(
//     targetNftIds.map((nftId) => sdk.uniswap_v3.positions_nft.ownerOf(nftId))
//   )
//   const wrongOwnerAtIndex = owners.findIndex(
//     (owner) => owner.toLowerCase() !== avatar.toLowerCase()
//   )
//   if (wrongOwnerAtIndex !== -1) {
//     throw new NotFoundError(
//       `NFT ID not owned by avatar: ${targetNftIds[wrongOwnerAtIndex]}`
//     )
//   }

//   return targetNftIds
// }

export const findToken = (
  tokens: readonly EthToken[],
  symbolOrAddress: string
) => {
  const symbolOrAddressLower = symbolOrAddress.toLowerCase()
  const token = tokens.find(
    (token) =>
      token.address.toLowerCase() === symbolOrAddressLower ||
      token.symbol.toLowerCase() === symbolOrAddressLower
  )
  if (!token) {
    throw new NotFoundError(`Token not found: ${symbolOrAddress}`)
  }
  return token.address
}

export const queryTokens = async (nftIds: BigNumber[]) => {
  const positions = await Promise.all(
    nftIds.map((nftId) => sdk.uniswap_v3.positions_nft.positions(nftId))
  )
  const result = new Set<`0x${string}`>()
  for (const position of positions) {
    result.add(findToken(ethInfo, position[2])) // token0
    result.add(findToken(ethInfo, position[3])) // token1
  }

  return [...result]
}
