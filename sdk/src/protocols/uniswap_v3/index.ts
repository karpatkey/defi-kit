import { queryTokens, findToken } from "./utils"
import { EthToken } from "./types"
import { allowErc20Approve, oneOf } from "../../conditions"
import { contracts } from "../../../eth-sdk/config"
import { allow } from "zodiac-roles-sdk/kit"
import { c, Permission } from "zodiac-roles-sdk"
import ethInfo from "./_ethInfo"
import { BigNumber } from "ethers"
import { NotFoundError } from "../../errors"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export const eth = {
  deposit: async ({
    targets,
    tokens,
    avatar,
  }: {
    /** Position NFT token IDs to allow depositing into. If unspecified, all positions owned by avatar can be managed that are in any pair of the specified `tokens`.
     *
     * **Attention:** If the avatar has approved the Uniswap NFT Position contract to spend tokens other than the ones specified in `tokens`, the role will be able to increase and decrease any existing positions' liquidity in these tokens as well.
     */
    targets?: string[]
    /** Positions can be minted for any pair of the specified `tokens`. If unspecified, minting of new positions won't be allowed. */
    tokens?: (EthToken["address"] | EthToken["symbol"])[]
    avatar: `0x${string}`
  }) => {
    if (!targets && !tokens) {
      throw new Error("Either `targets` or `tokens` must be specified.")
    }

    const nftIds =
      targets &&
      targets.map((target) => {
        try {
          return BigNumber.from(target)
        } catch (e) {
          // could not be parsed as BigNumber
          throw new NotFoundError(`Invalid NFT ID: ${target}`)
        }
      })

    const tokensForTargets = nftIds && (await queryTokens(nftIds))

    const mintTokenAddresses =
      tokens?.map((addressOrSymbol) => findToken(ethInfo, addressOrSymbol)) ||
      []

    const permissions: Permission[] = [
      ...allowErc20Approve(tokensForTargets || [], [
        contracts.mainnet.uniswap_v3.positions_nft,
      ]),
      ...allowErc20Approve(mintTokenAddresses, [
        contracts.mainnet.uniswap_v3.positions_nft,
      ]),
      {
        ...allow.mainnet.uniswap_v3.positions_nft.mint(
          {
            recipient: avatar,
            token0: oneOf(mintTokenAddresses),
            token1: oneOf(mintTokenAddresses),
          },
          {
            send: true,
          }
        ),
      },
      {
        ...allow.mainnet.uniswap_v3.positions_nft.increaseLiquidity(
          {
            tokenId: nftIds ? oneOf(nftIds) : c.avatarIsOwnerOfErc721,
          },
          {
            send: true,
          }
        ),
      },
      allow.mainnet.uniswap_v3.positions_nft.decreaseLiquidity(
        nftIds
          ? {
              tokenId: oneOf(nftIds),
            }
          : undefined
      ),
      allow.mainnet.uniswap_v3.positions_nft.collect({
        tokenId: nftIds ? oneOf(nftIds) : undefined,
        recipient: c.avatar,
      }),
    ]

    if (
      mintTokenAddresses.includes(contracts.mainnet.weth) ||
      tokensForTargets?.includes(contracts.mainnet.weth)
    ) {
      permissions.push(
        allow.mainnet.uniswap_v3.positions_nft.refundETH(),
        allow.mainnet.uniswap_v3.positions_nft.unwrapWETH9(undefined, c.avatar),
        allow.mainnet.uniswap_v3.positions_nft.collect({
          tokenId: nftIds ? oneOf(nftIds) : undefined,
          recipient: ZERO_ADDRESS,
        }),
        allow.mainnet.uniswap_v3.positions_nft.sweepToken(
          undefined,
          undefined,
          c.avatar
        )
      )
    }

    return permissions
  },
}
