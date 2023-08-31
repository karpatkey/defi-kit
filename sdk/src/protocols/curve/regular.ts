import { Permission } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"

import { allowErc20Approve } from "../../erc20"
import { Pool, Token } from "./types"

export const allowDeposit = (pool: Pool): Permission[] => {
  const tokens = (pool.tokens as readonly `0x${string}`[]).filter(
    (token) =>
      token.toLowerCase() !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  )

  const result: Permission[] = [
    ...allowErc20Approve(tokens, [pool.address]),
    {
      targetAddress: pool.address,
      signature: `add_liquidity(uint256[${pool.tokens.length}],uint256)`,
    },
  ]

  return result
}

export const allowWithdraw = (pool: Pool): Permission[] => {
  const result: Permission[] = [
    {
      targetAddress: pool.address,
      signature: "remove_liquidity_one_coin(uint256,int128,uint256)",
    },
    {
      targetAddress: pool.address,
      signature: "remove_liquidity(uint256,uint256[${pool.tokens.length}])",
    },
    {
      targetAddress: pool.address,
      signature: `remove_liquidity_imbalance(uint256[${pool.tokens.length}],uint256)`,
    },
  ]

  return result
}

export const allowSwap = (
  pool: Pool,
  sell: Token[] | undefined,
  buy: Token[] | undefined
): Permission[] => {
  const poolTokens = pool.tokens as readonly Token[]

  const sellIndices = sell
    ?.map((sellToken) => poolTokens.indexOf(sellToken))
    .filter((index) => index !== -1) // ignore tokens that are not in the pool
  const buyIndices = buy
    ?.map((buyToken) => poolTokens.indexOf(buyToken))
    .filter((index) => index !== -1) // ignore tokens that are not in the pool

  const tokensThatNeedApprove = (sell || []).filter(
    (token) =>
      poolTokens.indexOf(token) !== -1 &&
      token.toLowerCase() !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  )

  const result: Permission[] = [
    ...allowErc20Approve(tokensThatNeedApprove, [pool.address]),
    {
      ...allow.mainnet.curve.regularPool.exchange(sellIndices, buyIndices),
      targetAddress: pool.address,
    },
  ]

  if (pool.meta === true) {
    result.push({
      ...allow.mainnet.curve.metaPool.exchange_underlying(
        sellIndices,
        buyIndices
      ),
      targetAddress: pool.address,
    })
  }

  return result
}
