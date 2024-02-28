import { queryNftIds, queryTokens } from "../uniswap_v3/utils"
import { EthToken } from "./types"
import { allowErc20Approve } from "../../conditions"
import { contracts } from "../../../eth-sdk/config"
import { allow } from "zodiac-roles-sdk/kit"
import { c, Permission } from "zodiac-roles-sdk"
import { BigNumber } from "ethers"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"


export const eth = {
  deposit: async ({
    targets,
    tokens,
    avatar,
  }: {
    // nft ids
    targets?: string[]
    tokens?: (EthToken["address"] | EthToken["symbol"])[]
    avatar: `0x${string}`
  }) => {
    const nftIds = await queryNftIds(avatar, targets)
    const tokenAddresses = await queryTokens(nftIds, tokens)

    const permissions: Permission[] = [
      ...allowErc20Approve(tokenAddresses, [contracts.mainnet.uniswap_v3.positions_nft]),
      {
        ...allow.mainnet.uniswap_v3.positions_nft.mint(
          {
            recipient: avatar,
            token0: c.or(...(tokenAddresses as [string, string, ...string[]])),
            token1: c.or(...(tokenAddresses as [string, string, ...string[]])),
          },
          {
            send: true
          }
        )
      },
      {
        ...allow.mainnet.uniswap_v3.positions_nft.increaseLiquidity(
          {
            tokenId: c.or(...(nftIds as [BigNumber, BigNumber, ...BigNumber[]]))
          },
          {
            send: true
          }
        )
      },
      {
        ...allow.mainnet.uniswap_v3.positions_nft.decreaseLiquidity(
          {
            tokenId: c.or(...(nftIds as [BigNumber, BigNumber, ...BigNumber[]]))
          }
        )
      },
      {
        ...allow.mainnet.uniswap_v3.positions_nft.collect(
          {
            tokenId: c.or(...(nftIds as [BigNumber, BigNumber, ...BigNumber[]])),
            recipient: c.avatar
          }
        )
      }
    ]

    if (contracts.mainnet.weth in tokenAddresses) {
      permissions.push(
        allow.mainnet.uniswap_v3.positions_nft.refundETH(),
        allow.mainnet.uniswap_v3.positions_nft.unwrapWETH9(undefined, c.avatar),
        allow.mainnet.uniswap_v3.positions_nft.collect(
          {
            tokenId: c.or(...(nftIds as [BigNumber, BigNumber, ...BigNumber[]])),
            recipient: ZERO_ADDRESS
          }
        ),
        allow.mainnet.uniswap_v3.positions_nft.sweepToken(
          undefined,
          undefined,
          c.avatar
        )
      )
    }
  }
}