import { AVATAR, PresetAllowEntry, c } from "zodiac-roles-sdk"

import { Pool, Token } from "./types"
import { allowErc20Approve } from "../../erc20"
import { allow } from "zodiac-roles-sdk/kit"
import { matchesCalldata } from "../../conditions"
import { contracts } from "../../../eth-sdk/config"

export const deposit = (pool: Pool) => {
  return [
    ...allowErc20Approve(pool.tokens, contracts.mainnet.balancer.relayer),

    allow.mainnet.balancer.relayer.multicall(
      c.every(
        c.or(
          matchesCalldata(
            allow.mainnet.balancer.relayerLibrary.joinPool(
              pool.id,
              undefined, // TODO kind??
              AVATAR,
              AVATAR,
              {
                assets: pool.tokens, // TODO
              }
            )
          ),
          matchesCalldata()
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
