import { eth } from "."
import { avatar, member } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { parseUnits } from "ethers/lib/utils"
import { testKit } from "../../../test/kit"
import { BigNumber, ContractTransaction } from "ethers"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
const E_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
const STEAL_ADDRESS = "0x8eb8a3b98659cce290402893d0123abb75e3ab28"
const COLLECT_MAX_AMOUNT = 340282366920938463463374607431768211455n

const sdk = getMainnetSdk(avatar)

const getPosition = async (nftId: BigNumber) => {
  return sdk.uniswap_v3.positions_nft.positions(nftId)
}

const getPoolAddress = async (token0: string, token1: string, fee: number) => {
  return (await sdk.uniswap_v3.factory.getPool(
    token0,
    token1,
    fee
  )) as `0x${string}`
}

const getPoolSlot0 = async (poolAddress: `0x${string}`) => {
  return await sdk.uniswap_v3.pool.attach(poolAddress).slot0()
}

const calculateAmounts = async (
  tickLower: number,
  tickUpper: number,
  amount0Desired: bigint = 0n,
  amount1Desired: bigint = 0n,
  sqrtPriceX96?: bigint,
  nftId?: BigNumber
) => {
  if (!sqrtPriceX96) {
    if (!nftId) {
      throw new Error("sqrtPriceX96 is required if nftId is not provided")
    }
    const position = await getPosition(nftId)
    const poolAddress = await getPoolAddress(
      position[2],
      position[3],
      position[4]
    )
    const slot0 = await sdk.uniswap_v3.pool.attach(poolAddress).slot0()
    sqrtPriceX96 = BigInt(slot0[0].toString())
  }

  const n1 = 1.0001 ** (tickUpper / 2)
  const n2 = 1.0001 ** (tickLower / 2)

  if (amount1Desired) {
    amount0Desired =
      (BigInt(amount1Desired) *
        BigInt(2 ** 96) *
        (BigInt(n1 * 2 ** 96) - sqrtPriceX96)) /
      (BigInt(Number(sqrtPriceX96) * n1) *
        (sqrtPriceX96 - BigInt(n2 * 2 ** 96)))
  } else {
    amount1Desired =
      (BigInt(amount0Desired) *
        BigInt(Number(sqrtPriceX96) * n1) *
        (sqrtPriceX96 - BigInt(n2 * 2 ** 96))) /
      (BigInt(2 ** 96) * (BigInt(n1 * 2 ** 96) - sqrtPriceX96))
  }

  const amount0Min = (amount0Desired * BigInt(99)) / BigInt(100) // 1% slippage for token0
  const amount1Min = (amount1Desired * BigInt(99)) / BigInt(100) // 1% slippage for token1

  return [amount0Desired, amount1Desired, amount0Min, amount1Min]
}

const mintNFT = async (
  token0: `0x${string}`,
  token1: `0x${string}`,
  fee: number,
  amount0Desired: bigint = 0n,
  amount1Desired: bigint = 0n,
  throughRoles: boolean = false
) => {
  const kit = throughRoles ? testKit.eth : sdk

  let send = false
  let token0Decimals
  let token1Decimals
  if (token0 == E_ADDRESS) {
    send = true
    token0 = contracts.mainnet.weth
    token0Decimals = 18
  } else {
    token0Decimals = await sdk.weth.attach(token0).decimals()
  }
  if (token1 == E_ADDRESS) {
    send = true
    token1 = contracts.mainnet.weth
    token1Decimals = 18
  } else {
    token1Decimals = await sdk.weth.attach(token1).decimals()
  }

  const poolAddress = await getPoolAddress(token0, token1, fee)
  const slot0 = await getPoolSlot0(poolAddress)
  const sqrtPriceX96 = BigInt(slot0[0].toString())
  const sqrtPricen = (sqrtPriceX96 * BigInt(10 ** 18)) / BigInt(2 ** 96)
  const sqrtPrice = Number(sqrtPricen) / 10 ** 18
  const poolPrice = sqrtPrice ** 2 / 10 ** (token1Decimals - token0Decimals)
  const tickSpacing = await sdk.uniswap_v3.pool
    .attach(poolAddress)
    .tickSpacing()

  const token0MinPrice = poolPrice * 0.9 // 10% token0 min price deviation
  const token0MaxPrice = poolPrice * 1.1 // 10% token0 max price deviation

  const tickLower =
    Math.ceil(
      (Math.log10(token0MinPrice) + (token1Decimals - token0Decimals)) /
        Math.log10(1.0001) /
        tickSpacing
    ) * tickSpacing

  const tickUpper =
    Math.floor(
      (Math.log10(token0MaxPrice) + (token1Decimals - token0Decimals)) /
        Math.log10(1.0001) /
        tickSpacing
    ) * tickSpacing

  const amounts = await calculateAmounts(
    tickLower,
    tickUpper,
    amount0Desired,
    amount1Desired,
    sqrtPriceX96
  )

  amount0Desired = amounts[0]
  amount1Desired = amounts[1]
  const amount0Min = amounts[2]
  const amount1Min = amounts[3]

  let value = 0n
  if (send == false) {
    await stealErc20(token0, amount0Desired, STEAL_ADDRESS)
    await stealErc20(token1, amount1Desired, STEAL_ADDRESS)
    await sdk.weth
      .attach(token0)
      .approve(contracts.mainnet.uniswap_v3.positions_nft, amount0Desired)
    await sdk.weth
      .attach(token1)
      .approve(contracts.mainnet.uniswap_v3.positions_nft, amount1Desired)
  } else {
    if (token0 == contracts.mainnet.weth) {
      value = amount0Desired
      await stealErc20(token1, amount1Desired, STEAL_ADDRESS)
      await sdk.weth
        .attach(token1)
        .approve(contracts.mainnet.uniswap_v3.positions_nft, amount1Desired)
    } else {
      value = amount1Desired
      await stealErc20(token0, amount0Desired, STEAL_ADDRESS)
      await sdk.weth
        .attach(token0)
        .approve(contracts.mainnet.uniswap_v3.positions_nft, amount0Desired)
    }
  }

  let mint: ContractTransaction

  mint = await kit.uniswap_v3.positions_nft.mint(
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
      deadline: Math.floor(new Date().getTime() / 1000) + 1800,
    },
    { value: value }
  )

  console.log(mint)

  const ownedNfts = await sdk.uniswap_v3.positions_nft.balanceOf(
    avatar._address
  )
  let nftId = null
  if (ownedNfts.gt(0)) {
    nftId = await sdk.uniswap_v3.positions_nft.tokenOfOwnerByIndex(
      avatar._address,
      ownedNfts.sub(1)
    )
  }

  return nftId
}

describe("uniswap_v3", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      const nftId = await mintNFT(
        contracts.mainnet.usdc,
        E_ADDRESS,
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
          avatar: avatar._address as `0x${string}`,
        })
      )
    }, 30000)

    it("mint new position only with `tokens`", async () => {
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
          { value: amount1Desired }
        )
      ).not.toRevert()
      await expect(
        testKit.eth.uniswap_v3.positions_nft.refundETH()
      ).not.toRevert()
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
          { value: amount1Desired }
        )
      ).toBeForbidden()
    })

    it("decrease liquidity and collect using WETH", async () => {
      const nftId = await sdk.uniswap_v3.positions_nft.tokenOfOwnerByIndex(
        avatar._address,
        0
      )
      const position = await getPosition(nftId)
      console.log(Math.floor(position[7].div(2).toNumber()))
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

    it("decrease liquidity and collect using ETH", async () => {
      const nftId = await sdk.uniswap_v3.positions_nft.tokenOfOwnerByIndex(
        avatar._address,
        0
      )
      const position = await getPosition(nftId)
      console.log(position[7].toNumber())
      await expect(
        testKit.eth.uniswap_v3.positions_nft.decreaseLiquidity({
          tokenId: nftId,
          liquidity: position[7],
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
          recipient: ZERO_ADDRESS,
        })
      ).not.toRevert()
      await expect(
        testKit.eth.uniswap_v3.positions_nft.unwrapWETH9(0, avatar._address)
      ).not.toRevert()
      await expect(
        testKit.eth.uniswap_v3.positions_nft.sweepToken(
          contracts.mainnet.usdc,
          0,
          avatar._address
        )
      ).not.toRevert()
    })
  })
})
