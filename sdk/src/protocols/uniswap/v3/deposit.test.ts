import { eth } from "."
import { avatar, member } from "../../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { parseUnits, parseEther } from "ethers/lib/utils"
import { testKit } from "../../../../test/kit"
import { mintNFT, getPosition, calculateAmounts } from "./testUtils"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
const E_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
const STEAL_ADDRESS = "0x8eb8a3b98659cce290402893d0123abb75e3ab28"
const COLLECT_MAX_AMOUNT = 340282366920938463463374607431768211455n

const sdk = getMainnetSdk(avatar)

describe("uniswap_v3", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await sdk.weth.deposit({ value:  parseEther("10")})

      const nftId = await mintNFT(
        contracts.mainnet.usdc,
        // E_ADDRESS, No ETH sending allowed.
        contracts.mainnet.weth,
        3000,
        0n,
        1000000000000000000n
      )
      console.log("Initial NFT Id: ", nftId?.toNumber() || 0)
      await applyPermissions(
        await eth.deposit({
          tokens: [
            contracts.mainnet.dai,
            contracts.mainnet.usdc,
            contracts.mainnet.weth,
          ],
          fees: ["0.01%"],
        })
      )
    }, 30000)

    it("mint new position only with `tokens` and `fees`", async () => {
      await expect(
        mintNFT(
          contracts.mainnet.dai,
          contracts.mainnet.usdc,
          100,
          1000000000000000000000n,
          0n,
          true
        )
      ).not.toRevert()
      await expect(
        mintNFT(
          contracts.mainnet.dai,
          contracts.mainnet.usdt,
          100,
          1000000000000000000000n,
          0n,
          true
        )
      ).toBeForbidden()
      await expect(
        mintNFT(
          contracts.mainnet.dai,
          contracts.mainnet.usdc,
          500,
          1000000000000000000000n,
          0n,
          true
        )
      ).toBeForbidden()
    }, 30000)

    it("only increase liquidity of the avatars' NFT", async () => {
      await stealErc20(
        contracts.mainnet.usdc,
        parseUnits("50000", 6),
        STEAL_ADDRESS
      )
      await expect(
        testKit.eth.usdc.approve(
          contracts.mainnet.uniswap_v3.positions_nft,
          parseUnits("50000", 6)
        )
      ).not.toRevert()
      await expect(
        testKit.eth.weth.approve(
          contracts.mainnet.uniswap_v3.positions_nft,
          parseEther("10")
        )
      ).not.toRevert()
      const nftId = await sdk.uniswap_v3.positions_nft.tokenOfOwnerByIndex(
        avatar._address,
        0
      )
      const position = await getPosition(nftId)
      const [amount0Desired, amount1Desired, amount0Min, amount1Min] =
        await calculateAmounts(
          position[5],
          position[6],
          0n,
          1000000000000000000n,
          undefined,
          nftId
        )

      await expect(
        testKit.eth.uniswap_v3.positions_nft.increaseLiquidity(
          {
            tokenId: nftId,
            amount0Desired: amount0Desired,
            amount1Desired: amount1Desired,
            amount0Min: amount0Min,
            amount1Min: amount1Min,
            deadline: Math.floor(new Date().getTime() / 1000) + 1800,
          },
          // { value: amount1Desired } No ETH sending allowed.
        )
      ).not.toRevert()
      // await expect(
      //   testKit.eth.uniswap_v3.positions_nft.refundETH()
      // ).not.toRevert()
      await expect(
        testKit.eth.uniswap_v3.positions_nft.increaseLiquidity(
          {
            tokenId: 1, // invalid nftId
            amount0Desired: amount0Desired,
            amount1Desired: amount1Desired,
            amount0Min: amount0Min,
            amount1Min: amount1Min,
            deadline: Math.floor(new Date().getTime() / 1000) + 1800,
          },
          // { value: amount1Desired } No ETH sending allowed.
        )
      ).toBeForbidden()
    })

    it("decrease liquidity and collect using WETH", async () => {
      const nftId = await sdk.uniswap_v3.positions_nft.tokenOfOwnerByIndex(
        avatar._address,
        0
      )
      const position = await getPosition(nftId)
      await expect(
        testKit.eth.uniswap_v3.positions_nft.decreaseLiquidity({
          tokenId: nftId,
          liquidity: Math.floor(position[7].div(2).toNumber()),
          amount0Min: 0,
          amount1Min: 0,
          deadline: Math.floor(new Date().getTime() / 1000) + 1800,
        })
      ).not.toRevert()
      await expect(
        testKit.eth.uniswap_v3.positions_nft.collect({
          tokenId: nftId,
          amount0Max: COLLECT_MAX_AMOUNT,
          amount1Max: COLLECT_MAX_AMOUNT,
          recipient: avatar._address,
        })
      ).not.toRevert()
      await expect(
        testKit.eth.uniswap_v3.positions_nft.collect({
          tokenId: nftId,
          amount0Max: COLLECT_MAX_AMOUNT,
          amount1Max: COLLECT_MAX_AMOUNT,
          recipient: member._address,
        })
      ).toBeForbidden()
    })

    // No ETH sending allowed.
    // it("decrease liquidity and collect using ETH", async () => {
    //   const nftId = await sdk.uniswap_v3.positions_nft.tokenOfOwnerByIndex(
    //     avatar._address,
    //     0
    //   )
    //   const position = await getPosition(nftId)
    //   await expect(
    //     testKit.eth.uniswap_v3.positions_nft.decreaseLiquidity({
    //       tokenId: nftId,
    //       liquidity: position[7],
    //       amount0Min: 0,
    //       amount1Min: 0,
    //       deadline: Math.floor(new Date().getTime() / 1000) + 1800,
    //     })
    //   ).not.toRevert()
    //   await expect(
    //     testKit.eth.uniswap_v3.positions_nft.collect({
    //       tokenId: nftId,
    //       amount0Max: COLLECT_MAX_AMOUNT,
    //       amount1Max: COLLECT_MAX_AMOUNT,
    //       recipient: ZERO_ADDRESS,
    //     })
    //   ).not.toRevert()
      // await expect(
      //   testKit.eth.uniswap_v3.positions_nft.unwrapWETH9(0, avatar._address)
      // ).not.toRevert()
      // await expect(
      //   testKit.eth.uniswap_v3.positions_nft.sweepToken(
      //     contracts.mainnet.usdc,
      //     0,
      //     avatar._address
      //   )
      // ).not.toRevert()
    // })
  })
})
