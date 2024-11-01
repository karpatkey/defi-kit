import { allow } from "zodiac-roles-sdk/kit"
import { Permission, c } from "zodiac-roles-sdk"
import { Pool, StakeToken, Token } from "./types"
import { allowErc20Approve } from "../../conditions"
import { contracts } from "../../../eth-sdk/config"
import balancerEthPools from "../balancer/_ethPools"
import balancerGnoPools from "../balancer/_gnoPools"
import { findPool as findBalancerPool } from "../balancer/index"
import { Chain } from "../../types"

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
export const AURA = "0xC0c293ce456fF0ED870ADd98a0828Dd4d2903DBF"

export const deposit = (
  chain: Chain.eth | Chain.gno,
  pool: Pool,
  tokens: readonly Token[] = pool.tokens
) => {
  const tokenAddresses = pool.tokens
    .map((token) => token.address)
    .filter((address) => tokens.some((token) => token.address === address))

  let booster: `0x${string}`
  let reward_pool_deposit_wrapper: `0x${string}`
  let balancer_pools
  switch (chain) {
    case Chain.eth:
      booster = contracts.mainnet.aura.booster as `0x${string}`
      reward_pool_deposit_wrapper = contracts.mainnet.aura
        .rewardPoolDepositWrapper as `0x${string}`
      balancer_pools = balancerEthPools

      break

    case Chain.gno:
      booster = contracts.gnosis.aura.booster as `0x${string}`
      reward_pool_deposit_wrapper = contracts.gnosis.aura
        .reward_pool_deposit_wrapper as `0x${string}`
      balancer_pools = balancerGnoPools

      break
  }

  const permissions: Permission[] = [
    ...allowErc20Approve([pool.bpt], [booster]),
    {
      ...allow.mainnet.aura.booster.deposit(pool.id),
      targetAddress: booster,
    },
    {
      ...allow.mainnet.aura.rewarder.withdrawAndUnwrap(),
      targetAddress: pool.rewarder,
    },
    {
      ...allow.mainnet.aura.rewarder["getReward()"](),
      targetAddress: pool.rewarder,
    },
    // Now the UI is using this function to claim rewards
    {
      ...allow.mainnet.aura.rewarder["getReward(address,bool)"](c.avatar),
      targetAddress: pool.rewarder,
    },
  ]

  if (tokenAddresses.length > 0) {
    permissions.push(
      ...allowErc20Approve(tokenAddresses, [reward_pool_deposit_wrapper]),
      {
        ...allow.mainnet.aura.rewardPoolDepositWrapper.depositSingle(
          pool.rewarder,
          c.or(...(tokenAddresses as [string, string, ...string[]])),
          undefined,
          findBalancerPool(balancer_pools, pool.bpt).id
        ),
        targetAddress: reward_pool_deposit_wrapper,
      }
    )
  }

  return permissions
}

// IMPORTANT: The stake action includes Compounding auraBAL
export const stake = (token: StakeToken): Permission[] => {
  const permissions: Permission[] = []

  switch (token.symbol) {
    case "BAL":
      permissions.push(
        ...allowErc20Approve(
          [token.address],
          [contracts.mainnet.aura.balDepositorWrapper]
        ),
        {
          ...allow.mainnet.aura.balDepositorWrapper.deposit(
            undefined,
            undefined,
            undefined,
            c.or(
              // mint auraBAL
              ZERO_ADDRESS,
              // Classic auraBAL staking
              contracts.mainnet.aura.auraBalStakingRewarder,
              // Compounder auraBAL
              contracts.mainnet.aura.auraBalStaker
            )
          ),
        }
      )
      break
    case "B-80BAL-20WETH":
      permissions.push(
        ...allowErc20Approve(
          [token.address],
          [contracts.mainnet.aura.b80Bal20WethDepositorWrapper]
        ),
        {
          ...allow.mainnet.aura.b80Bal20WethDepositorWrapper[
            "deposit(uint256,bool,address)"
          ](
            undefined,
            undefined,
            c.or(
              // mint auraBAL
              ZERO_ADDRESS,
              // Classic auraBAL staking
              contracts.mainnet.aura.auraBalStakingRewarder,
              // Compounder auraBAL
              contracts.mainnet.aura.auraBalStaker
            )
          ),
        }
      )
      break
    case "auraBAL":
      // Classic auraBAL staking
      permissions.push(
        ...allowErc20Approve(
          [token.address],
          [contracts.mainnet.aura.auraBalStakingRewarder]
        ),
        allow.mainnet.aura.auraBalStakingRewarder.stake()
      )

      // Compounder auraBAL
      permissions.push(
        ...allowErc20Approve(
          [token.address],
          [contracts.mainnet.aura.stkauraBal]
        ),
        allow.mainnet.aura.stkauraBal.deposit(undefined, c.avatar)
      )
      break
  }

  // Classic auraBAL staking
  permissions.push(allow.mainnet.aura.auraBalStakingRewarder.withdraw())
  permissions.push(allow.mainnet.aura.auraBalStakingRewarder["getReward()"]())

  // Compounder auraBAL
  permissions.push(
    allow.mainnet.aura.stkauraBal.withdraw(undefined, c.avatar, c.avatar),
    // When the MAX amount is unstaked
    allow.mainnet.aura.stkauraBal.redeem(undefined, c.avatar, c.avatar)
  )
  permissions.push(
    allow.mainnet.aura.auraBalCompoundingRewarder["getReward()"]()
  )

  return permissions
}

// Included in stake() action
// export const compound = (token: StakeToken) => {
//   const permissions: Permission[] = []

//   switch (token.symbol) {
//     case "BAL":
//       permissions.push(
//         ...allowErc20Approve(
//           [token.address],
//           [contracts.mainnet.aura.balDepositorWrapper]
//         ),
//         {
//           ...allow.mainnet.aura.balDepositorWrapper.deposit(
//             undefined,
//             undefined,
//             undefined,
//             c.or(ZERO_ADDRESS, contracts.mainnet.aura.auraBalStaker)
//           ),
//         }
//       )
//       break
//     case "B-80BAL-20WETH":
//       permissions.push(
//         ...allowErc20Approve(
//           [token.address],
//           [contracts.mainnet.aura.b80Bal20WethDepositorWrapper]
//         ),
//         {
//           ...allow.mainnet.aura.b80Bal20WethDepositorWrapper[
//             "deposit(uint256,bool,address)"
//           ](
//             undefined,
//             undefined,
//             c.or(ZERO_ADDRESS, contracts.mainnet.aura.auraBalStaker)
//           ),
//         }
//       )
//       break
//     case "auraBAL":
//       permissions.push(
//         ...allowErc20Approve(
//           [token.address],
//           [contracts.mainnet.aura.stkauraBal]
//         ),
//         allow.mainnet.aura.stkauraBal.deposit(undefined, c.avatar)
//       )
//       break
//   }

//   permissions.push(
//     allow.mainnet.aura.stkauraBal.withdraw(undefined, c.avatar, c.avatar),
//     // When the MAX amount is unstaked
//     allow.mainnet.aura.stkauraBal.redeem(undefined, c.avatar, c.avatar)
//   )
//   permissions.push(
//     allow.mainnet.aura.auraBalCompoundingRewarder["getReward()"]()
//   )

//   return permissions
// }

export const lock = (): Permission[] => {
  return [
    ...allowErc20Approve([AURA], [contracts.mainnet.aura.vlAura]),
    allow.mainnet.aura.vlAura.lock(c.avatar),
    allow.mainnet.aura.vlAura.processExpiredLocks(),
    allow.mainnet.aura.vlAura["getReward(address)"](c.avatar),
  ]
}
