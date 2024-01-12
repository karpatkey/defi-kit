import { allow } from "zodiac-roles-sdk/kit"
import { Permission, c } from "zodiac-roles-sdk"
import { Pool, StakeToken } from "./types"
import { allowErc20Approve } from "../../conditions"
import { contracts } from "../../../eth-sdk/config"

const CRV = "0xD533a949740bb3306d119CC777fa900bA034cd52"
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
export const CVX = "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b"

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
        ...allowErc20Approve([CRV], [contracts.mainnet.convex.CrvDepositor]),
        ...allowErc20Approve(
          [contracts.mainnet.convex.cvxCRV],
          [contracts.mainnet.convex.stkCvxCrv]
        ),
        allow.mainnet.convex.CrvDepositor["deposit(uint256,bool)"](),
        allow.mainnet.convex.stkCvxCrv.stake(undefined, c.avatar),
        allow.mainnet.convex.CrvDepositor["deposit(uint256,bool,address)"](
          undefined,
          undefined,
          c.or(ZERO_ADDRESS, contracts.mainnet.convex.stkCvxCrv)
        ),
        allow.mainnet.convex.stkCvxCrv.withdraw(),
        allow.mainnet.convex.stkCvxCrv.setRewardWeight(),
        allow.mainnet.convex.stkCvxCrv["getReward(address)"](c.avatar)
      )
      break
    case "CVX":
      permissions.push(
        ...allowErc20Approve([CVX], [contracts.mainnet.convex.cvxRewardPool]),
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
    ...allowErc20Approve([CVX], [contracts.mainnet.convex.vlCVX]),
    allow.mainnet.convex.vlCVX.lock(c.avatar),
    allow.mainnet.convex.vlCVX.processExpiredLocks(),
    allow.mainnet.convex.vlCVX["getReward(address,bool)"](c.avatar),
  ]
}
