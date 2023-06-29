import { allow } from "zodiac-roles-sdk/kit"
import { AVATAR, c } from "zodiac-roles-sdk/index"
import { Pool, StakeToken } from "./types"
import { allowErc20Approve } from "../../erc20"
import { contracts } from "../../../eth-sdk/config"
import balancerEthPools from "../balancer/_info"
import { findPool as findBalancerPool } from "../balancer/index"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export const deposit = (
  pool: Pool
) => {
  const tokens = pool.tokens.map((token) => token)
  const permissions = [
    ...allowErc20Approve([pool.bpt], [contracts.mainnet.aura.booster]),
    {
      ...allow.mainnet.aura.reward_pool_deposit_wrapper.depositSingle(
        pool.rewarder,
        c.or(...(tokens as [string, string, ...string[]])),
        undefined,
        findBalancerPool(balancerEthPools, pool.bpt).id,
      )
    },
    allow.mainnet.aura.booster.deposit(pool.id),
    allow.mainnet.aura.rewarder.withdrawAndUnwrap(),
    allow.mainnet.aura.rewarder["getReward()"]
  ]

  return permissions
}

export const stake = (
  token: StakeToken
) => {
  const permissions = []

  switch (token.symbol) {
    case "BAL":
      permissions.push(
        ...allowErc20Approve([token.address], [contracts.mainnet.aura.bal_depositor_wrapper]),
        {
          ...allow.mainnet.aura.bal_depositor_wrapper.deposit(
            undefined,
            undefined,
            undefined,
            c.or(ZERO_ADDRESS, contracts.mainnet.aura.aurabal_staking_rewarder)
          )
        }
      )
      break
    case "B-80BAL-20WETH":
      permissions.push(
        ...allowErc20Approve([token.address], [contracts.mainnet.aura.b_80bal_20weth_depositor_wrapper]),
        {
          ...allow.mainnet.aura.b_80bal_20weth_depositor_wrapper["deposit(uint256,bool,address)"](
            undefined,
            undefined,
            c.or(ZERO_ADDRESS, contracts.mainnet.aura.aurabal_staking_rewarder)
          )
        }
      )
      break
    case "auraBAL":
      permissions.push(
        ...allowErc20Approve([token.address], [contracts.mainnet.aura.aurabal_staking_rewarder]),
        allow.mainnet.aura.aurabal_staking_rewarder.stake(),
        allow.mainnet.aura.aurabal_staking_rewarder.withdraw()
      )
      break
  }

  permissions.push(
    allow.mainnet.aura.aurabal_staking_rewarder["getReward()"]
  )

  return permissions
}