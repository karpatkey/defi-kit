import { NotFoundError } from "../../../errors"
import { Token } from "./types"
import ethInfo from "./_ethInfo"
import gnoInfo from "./_gnoInfo"
import arb1Info from "./_arb1Info"
import oethInfo from "./_oethInfo"
import baseInfo from "./_baseInfo"
import { Chain } from "../../../../src"
import { sdks as prodSdks } from "../../../sdks"
import { testSdks } from "../../../../test/sdks"

const sdks = process.env.NODE_ENV === "test" ? testSdks : prodSdks

// Mapping chain to corresponding token list
const tokenLists: Record<Chain, readonly Token[]> = {
  [Chain.eth]: ethInfo,
  [Chain.gno]: gnoInfo,
  [Chain.arb1]: arb1Info,
  [Chain.oeth]: oethInfo,
  [Chain.base]: baseInfo,
}

export const findToken = (
  tokens: readonly Token[],
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

export const queryTokens = async (chain: Chain, nftIds: bigint[]) => {
  const tokens = tokenLists[chain]

  const positions = await Promise.all(
    nftIds.map((nftId) => sdks[chain].uniswapV3.positionsNft.positions(nftId))
  )
  const result = new Set<`0x${string}`>()
  for (const position of positions) {
    result.add(findToken(tokens, position[2])) // token0
    result.add(findToken(tokens, position[3])) // token1
  }

  return [...result]
}
