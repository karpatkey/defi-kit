import { PresetAllowEntry, c } from "zodiac-roles-sdk"

import { Pool, Token } from "./types"
import { allowErc20Approve } from "../../erc20"
import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "../../../eth-sdk/config"

export const deposit = (pool: Pool, tokens: readonly Token[] = pool.tokens) => {
  return [
    ...allowErc20Approve(tokens, [contracts.mainnet.balancer.vault]),

    allow.mainnet.balancer.relayer.multicall(
      c.every(
        c.or(
          c.calldataMatches(
            allow.mainnet.balancer.relayerLibrary.joinPool(
              pool.id,
              undefined, // TODO kind??
              c.avatar,
              c.avatar,
              {
                assets: pool.tokens, // TODO should be ordered by address
              }
            )
          ),

          c.calldataMatches(
            // TODO update to next function
            allow.mainnet.balancer.relayerLibrary.joinPool(
              pool.id,
              undefined, // TODO kind??
              c.avatar,
              c.avatar,
              {
                assets: pool.tokens, // TODO should be ordered by address
              }
            )
          )
        )
      )
    ),
  ]
}

export const swap = (
  pool: Pool,
  sell: Token[] | undefined,
  buy: Token[] | undefined
) => {
  const result: PresetAllowEntry[] = []

  return result
}
