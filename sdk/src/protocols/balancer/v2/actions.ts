import { Permission, c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve } from "../../../conditions"
import { Pool, Token } from "./types"
import { contracts } from "../../../../eth-sdk/config"
import { Chain } from "../../../types"

export const bal = "0xba100000625a3754423978a60c9317c58a424e3D"
export const b80Bal20Weth = "0x5c6Ee304399DBdB9C8Ef030aB642B10820DB8F56"
export const b80Bal20WethPid =
  "0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014"
export const bbaUsdV1 = "0x7B50775383d3D6f0215A8F290f2C9e2eEBBEceb2"
export const bbaUsdV2 = "0xA13a9247ea42D743238089903570127DdA72fE44"
export const bbaUsdV3 = "0xfeBb0bbf162E64fb9D0dfe186E517d84C395f016"

export const deposit = (pool: Pool, tokens: readonly Token[] = pool.tokens) => {
  const tokenAddresses = pool.tokens
    .map((token) => token.address)
    .filter((address) => tokens.some((token) => token.address === address))

  const permissions: Permission[] = [
    ...allowErc20Approve(tokenAddresses, [contracts.mainnet.balancerV2.vault]),

    allow.mainnet.balancerV2.vault.joinPool(
      pool.id,
      c.avatar,
      c.avatar,
      undefined,
      // Independently if one of the tokens added is ETH or not we must
      // add the send: true because Roles mod does not support scoping
      // the same function with different option values.
      {
        send: true,
      }
    ),

    allow.mainnet.balancerV2.vault.exitPool(pool.id, c.avatar, c.avatar),
  ]

  return permissions
}

export const stake = (chain: Chain, pool: Pool) => {
  const permissions: Permission[] = []

  let minter: `0x${string}`
  let relayer: `0x${string}`

  switch (chain) {
    case Chain.eth:
      minter = contracts.mainnet.balancerV2.minter as `0x${string}`
      relayer = contracts.mainnet.balancerV2.relayer as `0x${string}`
      break

    case Chain.gno:
      minter = contracts.gnosis.balancerV2.minter as `0x${string}`
      relayer = contracts.gnosis.balancerV2.relayer as `0x${string}`
      break

    case Chain.arb1:
      minter = contracts.arbitrumOne.balancerV2.minter as `0x${string}`
      relayer = contracts.arbitrumOne.balancerV2.relayer as `0x${string}`
      break

    case Chain.oeth:
      minter = contracts.optimism.balancerV2.minter as `0x${string}`
      relayer = contracts.optimism.balancerV2.relayer as `0x${string}`
      break

    case Chain.base:
      minter = contracts.base.balancerV2.minter as `0x${string}`
      relayer = contracts.base.balancerV2.relayer as `0x${string}`
      break

    default:
      throw new Error(`Unsupported chain: ${chain}`)
  }

  if (pool.gauge) {
    permissions.push(
      ...allowErc20Approve([pool.bpt], [pool.gauge]),
      {
        ...allow.mainnet.balancerV2.gauge["deposit(uint256)"](),
        targetAddress: pool.gauge,
      },
      {
        ...allow.mainnet.balancerV2.gauge["withdraw(uint256)"](),
        targetAddress: pool.gauge,
      },
      {
        ...allow.mainnet.balancerV2.gauge["claim_rewards()"](),
        targetAddress: pool.gauge,
      },
      {
        ...allow.mainnet.balancerV2.minter.mint(pool.gauge),
        targetAddress: minter,
      },

      // New permissions for Unstaking and Claiming
      allow.mainnet.balancerV2.vault.setRelayerApproval(c.avatar, relayer),
      {
        ...allow.mainnet.balancerV2.relayer.gaugeWithdraw(
          pool.gauge,
          c.avatar,
          c.avatar
        ),
        targetAddress: relayer,
      },
      // New permissions for Claiming and Claiming All
      {
        ...allow.mainnet.balancerV2.minter.setMinterApproval(relayer),
        targetAddress: minter,
      },
      // vault.setRelayerApproval() already added
      {
        ...allow.mainnet.balancerV2.relayer.gaugeClaimRewards([pool.gauge]), // WARNING!!: Specify gauge?
        targetAddress: relayer,
      },
      {
        ...allow.mainnet.balancerV2.relayer.gaugeMint([pool.gauge]), // WARNING!!: Specify gauge?
        targetAddress: relayer,
      }
    )
  }

  return permissions
}

export const lock = (): Permission[] => {
  return [
    ...allowErc20Approve(
      [bal, contracts.mainnet.weth],
      [contracts.mainnet.balancerV2.vault]
    ),
    ...allowErc20Approve([b80Bal20Weth], [contracts.mainnet.balancerV2.veBal]),
    allow.mainnet.balancerV2.vault.joinPool(
      b80Bal20WethPid,
      c.avatar,
      c.avatar,
      undefined,
      { send: true }
    ),
    allow.mainnet.balancerV2.vault.exitPool(
      b80Bal20WethPid,
      c.avatar,
      c.avatar
    ),
    // As Safes are smart contracts they are not allowed to lock veBAL
    // if the they are not whitelisted previously by Balancer:
    // https://forum.balancer.fi/t/allow-for-gnosis-safe-to-be-used-for-vebal-locking/2698
    allow.mainnet.balancerV2.veBal.create_lock(),
    allow.mainnet.balancerV2.veBal.increase_amount(),
    allow.mainnet.balancerV2.veBal.increase_unlock_time(),
    allow.mainnet.balancerV2.veBal.withdraw(),
    allow.mainnet.balancerV2.feeDistributor.claimToken(c.avatar),
    allow.mainnet.balancerV2.feeDistributor.claimTokens(c.avatar),
  ]
}

// export const swap = (
//   pool: Pool,
//   sell: Token[] | undefined,
//   buy: Token[] | undefined
// ) => {
//   const result: Permission[] = []

//   return result
// }
