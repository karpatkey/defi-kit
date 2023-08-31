import { Permission } from "zodiac-roles-sdk"
import { allowErc20Approve } from "../../erc20"

import { Pool } from "./types"

export const allowFactoryPool = (pool: Pool): Permission[] => {
  const result: Permission[] = [
    //Gotta make sure the token address is not "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ...allowErc20Approve(
      (pool.tokens as readonly `0x${string}`[]).filter(
        (token) =>
          token.toLowerCase() !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
      ),
      [pool.address]
    ),
    {
      targetAddress: pool.address,
      signature: `add_liquidity(uint256[${pool.tokens.length}],uint256)`,
    },
    {
      targetAddress: pool.address,
      signature: "remove_liquidity_one_coin(uint256,int128,uint256)",
    },
    {
      targetAddress: pool.address,
      signature: `remove_liquidity(uint256,uint256[${pool.tokens.length}])`,
    },
    {
      targetAddress: pool.address,
      signature: `remove_liquidity_imbalance(uint256[${pool.tokens.length}],uint256)`,
    },
    {
      targetAddress: pool.address,
      signature: "exchange(int128,int128,uint256,uint256)",
    },
  ]

  if (pool.meta) {
    result.push({
      targetAddress: pool.address,
      signature: "exchange_underlying(int128,int128,uint256,uint256)",
    })
  }

  return result
}
