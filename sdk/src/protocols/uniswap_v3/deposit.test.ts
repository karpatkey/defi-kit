import { eth } from "."
import { avatar } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { parseEther, parseUnits } from "ethers/lib/utils"
import { testKit } from "../../../test/kit"

const E_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

const sdk = getMainnetSdk(avatar)

const mintNFT = async (
  token0: `0x${string}`,
  token1: `0x${string}`,
  fee: bigint,
  amount0Desired: bigint = 0n,
  amount1Desired: bigint = 0n,
) => {

  let send = false
  if (token0 == E_ADDRESS) {
    send = true
    token0 = contracts.mainnet.weth
  }
  if (token1 == E_ADDRESS) {
    send = true
    token1 = contracts.mainnet.weth
  }

  const poolAddress = await sdk.uniswap_v3.factory.getPool(token0, token1, fee)
  const slot0 = await sdk.uniswap_v3.pool.attach(poolAddress).slot0()
  const sqrtPriceX96 = BigInt(slot0[0].toString())
  const sqrtPricen = sqrtPriceX96 / (BigInt(2) ** BigInt(96));
  const sqrtPrice = Number(sqrtPricen)
  const poolPrice = sqrtPrice ** 2 / (10 ** (18 - 6)) // 18-6 = token1_decimals - token0_decimals
  const tickSpacing = await sdk.uniswap_v3.pool.attach(poolAddress).tickSpacing()

  const token0MinPrice = poolPrice * 0.9 // 10% token0 min price deviation
  const token0MaxPrice = poolPrice * 1.1 // 10% token0 max price deviation

  const tickLower = Math.ceil(
    (Math.log10(token0MinPrice) + (18 - 6))
    / Math.log10(1.0001)
    / tickSpacing
  ) * tickSpacing

  const tickUpper = Math.floor(
    (
      Math.log10(token0MaxPrice) + (18 - 6))
    / Math.log10(1.0001)
    / tickSpacing
  ) * tickSpacing

  const n1 = BigInt(Math.round(1.0001 ** (tickUpper / 2)))
  const n2 = BigInt(Math.round(1.0001 ** (tickLower / 2)))

  if (amount1Desired) {
    amount0Desired = (BigInt(amount1Desired) * BigInt(2 ** 96) * (n1 * BigInt(2 ** 96) - sqrtPriceX96))
      / (sqrtPriceX96 * n1 * (sqrtPriceX96 - n2 * BigInt(2 ** 96)))
  } else {
    amount1Desired = (BigInt(amount0Desired) * sqrtPriceX96 * n1 * (sqrtPriceX96 - n2 * BigInt(2 ** 96)))
      / (BigInt(2 ** 96) * (n1 * BigInt(2 ** 96) - sqrtPriceX96))
  }

  const amount0Min = amount0Desired * BigInt(99) / BigInt(100) // 1% slippage for token0
  const amount1Min = amount1Desired * BigInt(99) / BigInt(100) // 1% slippage for token1

  let value = 0n
  if (send == false) {
    await stealErc20(
      token0,
      amount0Desired,
      contracts.mainnet.balancer.vault
    )
    await stealErc20(
      token1,
      amount1Desired,
      contracts.mainnet.balancer.vault
    )
    await sdk.weth.attach(token0).approve(
      contracts.mainnet.uniswap_v3.positions_nft,
      amount0Desired
    )
    await sdk.weth.attach(token1).approve(
      contracts.mainnet.uniswap_v3.positions_nft,
      amount1Desired
    )
  } else {
    if (token0 == contracts.mainnet.weth) {
      value = amount0Desired
      await stealErc20(
        token1,
        amount1Desired,
        contracts.mainnet.balancer.vault
      )
      await sdk.weth.attach(token1).approve(
        contracts.mainnet.uniswap_v3.positions_nft,
        amount1Desired
      )
    } else {
      value = amount1Desired
      await stealErc20(
        token0,
        amount0Desired,
        contracts.mainnet.balancer.vault
      )
      await sdk.weth.attach(token0).approve(
        contracts.mainnet.uniswap_v3.positions_nft,
        amount0Desired
      )
    }
  }

  const mint = await sdk.uniswap_v3.positions_nft.mint(
    {
      token0: token0,
      token1: token1,
      fee: fee,
      tickLower: tickLower,
      tickUpper: tickUpper,
      amount0Desired: amount0Desired,
      amount1Desired: amount1Desired,
      amount0Min: amount0Min,
      amount1Min: amount1Min,
      recipient: avatar._address,
      deadline: Math.floor(new Date().getTime() / 1000) + 1800
    },
    { value: value }
  )

  console.log(mint)

  const ownedNfts = await sdk.uniswap_v3.positions_nft.balanceOf(avatar._address)
  let nftId = null;
  if (ownedNfts.gt(0)) {
    nftId = await sdk.uniswap_v3.positions_nft.tokenOfOwnerByIndex(avatar._address, ownedNfts.sub(1))
  }

  return nftId
}

describe("uniswap_v3", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      const nftId = await mintNFT(contracts.mainnet.usdc, E_ADDRESS, 3000n, 0n, 1000000000000000000n)
      console.log("Initial NFT Id: ", nftId || 0)
      await applyPermissions(
        await eth.deposit({
          tokens: [contracts.mainnet.usdc, contracts.mainnet.dai],
          avatar: avatar._address as `0x${string}`
        })
      )
    })

    it("mint new position only with `tokens`", async () => {
      const newNftId = mintNFT(contracts.mainnet.dai, contracts.mainnet.usdc, 100n, 0n, 1000000000000000000000n)
      console.log("Minted NFT Id: ", newNftId || 0)
    })
  })
})