import { queryTokens, findToken } from "./utils"
import { EthToken, Fee } from "./types"
import { allowErc20Approve, oneOf } from "../../../conditions"
import { contracts } from "../../../../eth-sdk/config"
import { allow } from "zodiac-roles-sdk/kit"
import { c, Permission } from "zodiac-roles-sdk"
import ethInfo from "./_ethInfo"
import { NotFoundError } from "../../../errors"

const zeroAddress = "0x0000000000000000000000000000000000000000"

const FeeMapping: { [key: string]: number } = {
  "0.01%": 100,
  "0.05%": 500,
  "0.3%": 3000,
  "1%": 10000,
}

export const eth = {
  deposit: async ({
    targets,
    tokens,
    fees,
  }: {
    /** Position NFT token IDs to allow depositing into. If unspecified, all positions owned by avatar can be managed that are in any pair of the specified `tokens`.
     *
     * **Attention:** If the avatar has approved the Uniswap NFT Position contract to spend tokens other than the ones specified in `tokens`, the role will be able to increase and decrease any existing positions' liquidity in these tokens as well.
     */
    targets?: string[]
    /** Positions can be minted for any pair of the specified `tokens`. If unspecified, minting of new positions won't be allowed. */
    tokens?: (EthToken["address"] | EthToken["symbol"])[]
    fees?: Fee[]
  }) => {
    if (!targets && !tokens) {
      throw new Error("Either `targets` or `tokens` must be specified.")
    }

    if (targets && targets.length === 0)
      throw new Error("`targets` must not be empty")

    const mintFees = fees?.map((fee) => FeeMapping[fee]) || undefined
    const nftIds =
      targets &&
      targets.map((target) => {
        try {
          return BigInt(target)
        } catch (e) {
          // could not be parsed as BigInt
          throw new NotFoundError(`Invalid NFT ID: ${target}`)
        }
      })

    const tokensForTargets = (nftIds && (await queryTokens(nftIds))) || []

    const mintTokenAddresses =
      tokens?.map((addressOrSymbol) => findToken(ethInfo, addressOrSymbol)) ||
      []

    const permissions: Permission[] = [
      ...allowErc20Approve(tokensForTargets || [], [
        contracts.mainnet.uniswapV3.positionsNft,
      ]),
      ...allowErc20Approve(mintTokenAddresses, [
        contracts.mainnet.uniswapV3.positionsNft,
      ]),
      allow.mainnet.uniswapV3.positionsNft.increaseLiquidity(
        {
          tokenId: nftIds ? oneOf(nftIds) : c.avatarIsOwnerOfErc721,
        }
        // No ETH sending allowed.
        // {
        //   send: true,
        // }
      ),
      allow.mainnet.uniswapV3.positionsNft.decreaseLiquidity(
        nftIds
          ? {
              tokenId: oneOf(nftIds),
            }
          : undefined
      ),
      allow.mainnet.uniswapV3.positionsNft.collect({
        tokenId: nftIds ? oneOf(nftIds) : undefined,
        recipient: c.avatar,
      }),
    ]

    if (mintTokenAddresses && mintTokenAddresses.length > 0) {
      permissions.push(
        allow.mainnet.uniswapV3.positionsNft.mint(
          {
            recipient: c.avatar,
            token0: oneOf(mintTokenAddresses),
            token1: oneOf(mintTokenAddresses),
            fee: mintFees && mintFees.length > 0 ? oneOf(mintFees) : undefined,
          }
          // No ETH sending allowed
          // {
          //   send: true,
          // }
        )
      )
    }

    // No ETH sending allowed
    /* if (
      mintTokenAddresses.includes(contracts.mainnet.weth) ||
      tokensForTargets?.includes(contracts.mainnet.weth)
    ) {
      permissions.push(
        allow.mainnet.uniswapV3.positionsNft.refundETH({ send: true }),
        allow.mainnet.uniswapV3.positionsNft.unwrapWETH9(undefined, c.avatar),
        allow.mainnet.uniswapV3.positionsNft.collect({
          tokenId: nftIds ? oneOf(nftIds) : undefined,
          recipient: zeroAddress,
        }),
        allow.mainnet.uniswapV3.positionsNft.sweepToken(
          undefined,
          undefined,
          c.avatar
        )
      )
    } */

    return permissions
  },
}
