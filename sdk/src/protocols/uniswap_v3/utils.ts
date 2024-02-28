import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { NotFoundError } from "../../errors"
import { BigNumber } from "ethers"
import { ethProvider } from "../../provider"
import { getProvider } from "../../../test/provider"
import { EthToken } from "./types"
import ethInfo from "./_ethInfo"

const sdk = getMainnetSdk(
  process.env.NODE_ENV === "test" ? getProvider() : ethProvider
)

export const queryNftIds = async (avatar: `0x${string}`, targets?: string[]) => {
  const nftIds: BigNumber[] = []

  const nftIndexes = await sdk.uniswap_v3.positions_nft.balanceOf(avatar)

  if (!nftIndexes) {
    throw new NotFoundError(`No NFT Ids found for avatar: ${avatar}`)
  }

  for (let i = 0; i < nftIndexes.toNumber(); i++) {
    nftIds.push(await sdk.uniswap_v3.positions_nft.tokenOfOwnerByIndex(avatar, i))
  }

  const targetNftIds = targets?.map((target) => {
    try {
      return BigNumber.from(target)
    } catch (e) {
      // could not be parsed as BigNumber
      throw new NotFoundError(`NFT Id not found: ${target}`)
    }
  })
  targetNftIds?.forEach((target) => {
    if (!nftIds.some((nftId) => nftId.eq(target))) {
      throw new NotFoundError(`NFT Id not found: ${target}`)
    }
  })

  return targetNftIds || nftIds
}

const findToken = (tokens: readonly EthToken[], symbolOrAddress: string) => {
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

export const queryTokens = async (nftIds: BigNumber[], tokens?: (EthToken["address"] | EthToken["symbol"])[]) => {
  const tokenAddresses = tokens?.map((addressOrSymbol) => findToken(ethInfo, addressOrSymbol)) || []

  for (const nftId of nftIds) {
    const position = await sdk.uniswap_v3.positions_nft.positions(nftId)
    tokenAddresses.push(findToken(ethInfo, position[2])) // token0
    tokenAddresses.push(findToken(ethInfo, position[3])) // token1
  }

  return tokenAddresses
}