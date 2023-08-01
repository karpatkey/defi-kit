import { PresetAllowEntry, c } from "zodiac-roles-sdk"

import { Pool, Token } from "./types"
import { allowErc20Approve } from "../../erc20"
import { allow } from "zodiac-roles-sdk/kit"
import { contracts } from "../../../eth-sdk/config"

export const deposit = (pool: Pool, tokens: readonly Token[] = pool.tokens) => {
  const tokenAddresses = pool.tokens
    .map((token) => token.address)
    .filter((address) => tokens.some((token) => token.address === address))

  const tokenPoolIds = (pool.tokens as readonly Token[])
    .filter(
      (token) =>
        tokens.some((t) => token.address === t.address) && token.id !== null
    )
    .map((token) => token.id)

  const permissions: PresetAllowEntry[] = [
    ...allowErc20Approve(tokenAddresses, [contracts.mainnet.balancer.vault]),

    allow.mainnet.balancer.vault.joinPool(pool.id, c.avatar, c.avatar, {
      assets: tokens.map((token) => token.address.toLowerCase()).sort(),
    }),

    allow.mainnet.balancer.vault.exitPool(pool.id, c.avatar, c.avatar, {
      assets: tokens.map((token) => token.address.toLowerCase()).sort(),
    }),
  ]

  if (tokenPoolIds.length > 0) {
    permissions.push(
      allow.mainnet.balancer.vault.swap(
        { poolId: c.or(...(tokenPoolIds as [string, string, ...string[]])) },
        { recipient: c.avatar, sender: c.avatar }
      ),

      allow.mainnet.balancer.vault.setRelayerApproval(
        c.avatar,
        contracts.mainnet.balancer.relayer
      ),

      allow.mainnet.balancer.relayer.multicall(
        c.every(
          c.or(
            c.calldataMatches(
              allow.mainnet.balancer.relayerLibrary.joinPool(
                pool.id,
                undefined,
                c.avatar,
                c.avatar,
                {
                  assets: pool.tokens
                    .map((token) => token.address.toLowerCase())
                    .sort(),
                }
              )
            ),

            c.calldataMatches(
              // TODO update to next function
              allow.mainnet.balancer.relayerLibrary.exitPool(
                pool.id,
                undefined,
                c.avatar,
                c.avatar,
                {
                  assets: pool.tokens
                    .map((token) => token.address.toLowerCase())
                    .sort(),
                }
              )
            ),

            c.calldataMatches(
              // TODO update to next function
              allow.mainnet.balancer.relayerLibrary.swap(
                {
                  poolId: c.or(
                    ...(tokenPoolIds as [string, string, ...string[]])
                  ),
                },
                { recipient: c.avatar, sender: c.avatar }
              )
            )
          )
        )
      )
    )
  }
}

export const swap = (
  pool: Pool,
  sell: Token[] | undefined,
  buy: Token[] | undefined
) => {
  const result: PresetAllowEntry[] = []

  return result
}
