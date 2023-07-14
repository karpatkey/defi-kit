import { allow } from "zodiac-roles-sdk/kit"
import { PresetAllowEntry, c } from "zodiac-roles-sdk"
import { Pool, StakeToken, Token } from "./types"
import { allowErc20Approve } from "../../erc20"
import { contracts } from "../../../eth-sdk/config"
import balancerEthPools from "../balancer/_info"
import { findPool as findBalancerPool } from "../balancer/index"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
const AURA = "0xC0c293ce456fF0ED870ADd98a0828Dd4d2903DBF"

export const deposit = (pool: Pool, tokens: readonly Token[] = pool.tokens) => {
  const tokenAddresses = pool.tokens
    .map((token) => token.address)
    .filter((address) => tokens.some((token) => token.address === address))

  const permissions: PresetAllowEntry[] = [
    ...allowErc20Approve([pool.bpt], [contracts.mainnet.aura.booster]),
    allow.mainnet.aura.booster.deposit(pool.id),
    allow.mainnet.aura.rewarder.withdrawAndUnwrap(),
    allow.mainnet.aura.rewarder["getReward()"](),
  ]

  if (tokenAddresses.length > 0) {
    permissions.push(
      ...allowErc20Approve(tokenAddresses, [
        contracts.mainnet.aura.reward_pool_deposit_wrapper,
      ]),
      allow.mainnet.aura.reward_pool_deposit_wrapper.depositSingle(
        pool.rewarder,
        c.or(...(tokenAddresses as [string, string, ...string[]])),
        undefined,
        findBalancerPool(balancerEthPools, pool.bpt).id
      )
    )
  }

  return permissions
}

export const stake = (token: StakeToken): PresetAllowEntry[] => {
  const permissions: PresetAllowEntry[] = []

  switch (token.symbol) {
    case "BAL":
      permissions.push(
        ...allowErc20Approve(
          [token.address],
          [contracts.mainnet.aura.bal_depositor_wrapper]
        ),
        {
          ...allow.mainnet.aura.bal_depositor_wrapper.deposit(
            undefined,
            undefined,
            undefined,
            c.or(ZERO_ADDRESS, contracts.mainnet.aura.aurabal_staking_rewarder)
          ),
        }
      )
      break
    case "B-80BAL-20WETH":
      permissions.push(
        ...allowErc20Approve(
          [token.address],
          [contracts.mainnet.aura.b_80bal_20weth_depositor_wrapper]
        ),
        {
          ...allow.mainnet.aura.b_80bal_20weth_depositor_wrapper[
            "deposit(uint256,bool,address)"
          ](
            undefined,
            undefined,
            c.or(ZERO_ADDRESS, contracts.mainnet.aura.aurabal_staking_rewarder)
          ),
        }
      )
      break
    case "auraBAL":
      permissions.push(
        ...allowErc20Approve(
          [token.address],
          [contracts.mainnet.aura.aurabal_staking_rewarder]
        ),
        allow.mainnet.aura.aurabal_staking_rewarder.stake()
      )
      break
  }

  permissions.push(allow.mainnet.aura.aurabal_staking_rewarder.withdraw())
  permissions.push(allow.mainnet.aura.aurabal_staking_rewarder["getReward()"]())

  return permissions
}

export const compound = (token: StakeToken) => {
  const permissions: PresetAllowEntry[] = []

  switch (token.symbol) {
    case "BAL":
      permissions.push(
        ...allowErc20Approve(
          [token.address],
          [contracts.mainnet.aura.bal_depositor_wrapper]
        ),
        {
          ...allow.mainnet.aura.bal_depositor_wrapper.deposit(
            undefined,
            undefined,
            undefined,
            c.or(ZERO_ADDRESS, contracts.mainnet.aura.aurabal_staker)
          ),
        }
      )
      break
    case "B-80BAL-20WETH":
      permissions.push(
        ...allowErc20Approve(
          [token.address],
          [contracts.mainnet.aura.b_80bal_20weth_depositor_wrapper]
        ),
        {
          ...allow.mainnet.aura.b_80bal_20weth_depositor_wrapper[
            "deposit(uint256,bool,address)"
          ](
            undefined,
            undefined,
            c.or(ZERO_ADDRESS, contracts.mainnet.aura.aurabal_staker)
          ),
        }
      )
      break
    case "auraBAL":
      permissions.push(
        ...allowErc20Approve(
          [token.address],
          [contracts.mainnet.aura.stkaurabal]
        ),
        allow.mainnet.aura.stkaurabal.deposit(undefined, c.avatar)
      )
      break
  }

  permissions.push(
    allow.mainnet.aura.stkaurabal.withdraw(undefined, c.avatar, c.avatar),
    // When the MAX amount is unstaked
    allow.mainnet.aura.stkaurabal.redeem(undefined, c.avatar, c.avatar)
  )
  permissions.push(
    allow.mainnet.aura.aurabal_compounding_rewarder["getReward()"]()
  )

  return permissions
}

export const lock = (): PresetAllowEntry[] => {
  return [
    ...allowErc20Approve([AURA], [contracts.mainnet.aura.aura_locker]),
    allow.mainnet.aura.aura_locker.lock(c.avatar),
    allow.mainnet.aura.aura_locker.processExpiredLocks(),
    allow.mainnet.aura.aura_locker["getReward(address)"](c.avatar),
  ]
}
