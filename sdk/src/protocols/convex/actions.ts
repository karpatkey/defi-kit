import { allow } from "zodiac-roles-sdk/kit"
import { Permission, c } from "zodiac-roles-sdk"
import { Pool, StakeToken } from "./types"
import { allowErc20Approve } from "../../conditions"
import { contracts } from "../../../eth-sdk/config"

export const crv = "0xD533a949740bb3306d119CC777fa900bA034cd52"
export const zeroAddress = "0x0000000000000000000000000000000000000000"
export const cvx = "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b"

export const deposit = (pool: Pool) => {
  const permissions: Permission[] = [
    ...allowErc20Approve([pool.crvLPToken], [contracts.mainnet.convex.booster]),
    ...allowErc20Approve([pool.cvxDepositToken], [pool.rewarder]),

    allow.mainnet.convex.booster.deposit(pool.id),
    allow.mainnet.convex.booster.depositAll(pool.id),
    allow.mainnet.convex.booster.withdraw(pool.id),

    {
      ...allow.mainnet.convex.rewarder.stake(),
      targetAddress: pool.rewarder,
    },
    {
      ...allow.mainnet.convex.rewarder.withdraw(),
      targetAddress: pool.rewarder,
    },
    {
      ...allow.mainnet.convex.rewarder.withdrawAndUnwrap(),
      targetAddress: pool.rewarder,
    },
    {
      ...allow.mainnet.convex.rewarder["getReward(address,bool)"](c.avatar),
      targetAddress: pool.rewarder,
    },
  ]

  return permissions
}

export const stake = (token: StakeToken): Permission[] => {
  const permissions: Permission[] = []

  switch (token.symbol) {
    case "cvxCRV":
      permissions.push(
        ...allowErc20Approve([crv], [contracts.mainnet.convex.crvDepositor]),
        ...allowErc20Approve(
          [contracts.mainnet.convex.cvxCrv],
          [contracts.mainnet.convex.stkCvxCrv]
        ),
        allow.mainnet.convex.crvDepositor["deposit(uint256,bool)"](),
        allow.mainnet.convex.stkCvxCrv.stake(undefined, c.avatar),
        allow.mainnet.convex.crvDepositor["deposit(uint256,bool,address)"](
          undefined,
          undefined,
          c.or(zeroAddress, contracts.mainnet.convex.stkCvxCrv)
        ),
        allow.mainnet.convex.stkCvxCrv.withdraw(),
        allow.mainnet.convex.stkCvxCrv.setRewardWeight(),
        allow.mainnet.convex.stkCvxCrv["getReward(address)"](c.avatar)
      )
      break
    case "CVX":
      permissions.push(
        ...allowErc20Approve([cvx], [contracts.mainnet.convex.cvxRewardPool]),
        allow.mainnet.convex.cvxRewardPool.stake(),
        allow.mainnet.convex.cvxRewardPool.withdraw(),
        allow.mainnet.convex.cvxRewardPool["getReward(bool)"]()
      )
      break
  }

  return permissions
}

export const lock = (): Permission[] => {
  return [
    ...allowErc20Approve([cvx], [contracts.mainnet.convex.vlCvx]),
    allow.mainnet.convex.vlCvx.lock(c.avatar),
    allow.mainnet.convex.vlCvx.processExpiredLocks(),
    allow.mainnet.convex.vlCvx["getReward(address,bool)"](c.avatar),
  ]
}
