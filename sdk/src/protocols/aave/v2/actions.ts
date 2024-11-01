import { allow } from "zodiac-roles-sdk/kit"
import { Permission, c } from "zodiac-roles-sdk"
import { Token, DelegateToken, StakeToken } from "./types"
import { allowErc20Approve } from "../../../conditions"
import { contracts } from "../../../../eth-sdk/config"

export const depositToken = (token: Token) => {
  const permissions: Permission[] = []

  if (token.symbol === "WETH") {
    permissions.push(
      ...allowErc20Approve(
        [contracts.mainnet.aaveV2.aWeth],
        [contracts.mainnet.aaveV2.wrappedTokenGatewayV2]
      )
    )
  } else {
    permissions.push(
      ...allowErc20Approve(
        [token.token],
        [contracts.mainnet.aaveV2.lendingPoolV2]
      )
    )
  }

  permissions.push(
    allow.mainnet.aaveV2.lendingPoolV2.deposit(
      token.token,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV2.lendingPoolV2.withdraw(
      token.token,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV2.lendingPoolV2.setUserUseReserveAsCollateral(
      token.token
    )
  )

  return permissions
}

export const depositEther = () => [
  allow.mainnet.aaveV2.wrappedTokenGatewayV2.depositETH(
    contracts.mainnet.aaveV2.lendingPoolV2,
    c.avatar,
    undefined,
    { send: true }
  ),
  ...allowErc20Approve(
    [contracts.mainnet.aaveV2.aWeth],
    [contracts.mainnet.aaveV2.wrappedTokenGatewayV2]
  ),
  allow.mainnet.aaveV2.wrappedTokenGatewayV2.withdrawETH(
    contracts.mainnet.aaveV2.lendingPoolV2,
    undefined,
    c.avatar
  ),
  allow.mainnet.aaveV2.lendingPoolV2.setUserUseReserveAsCollateral(
    contracts.mainnet.weth
  ),
]

export const borrowToken = (token: Token) => {
  return [
    ...allowErc20Approve(
      [token.token],
      [contracts.mainnet.aaveV2.lendingPoolV2]
    ),
    allow.mainnet.aaveV2.lendingPoolV2.borrow(
      token.token,
      undefined,
      undefined,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV2.lendingPoolV2.repay(
      token.token,
      undefined,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV2.lendingPoolV2.swapBorrowRateMode(token.token),
  ]
}

export const borrowEther = () => {
  return [
    allow.mainnet.aaveV2.variableDebtWeth.approveDelegation(
      contracts.mainnet.aaveV2.wrappedTokenGatewayV2
    ),
    allow.mainnet.aaveV2.stableDebtWeth.approveDelegation(
      contracts.mainnet.aaveV2.wrappedTokenGatewayV2
    ),
    allow.mainnet.aaveV2.wrappedTokenGatewayV2.borrowETH(
      contracts.mainnet.aaveV2.lendingPoolV2
    ),
    allow.mainnet.aaveV2.wrappedTokenGatewayV2.repayETH(
      contracts.mainnet.aaveV2.lendingPoolV2,
      undefined,
      undefined,
      c.avatar,
      { send: true }
    ),
    allow.mainnet.aaveV2.lendingPoolV2.swapBorrowRateMode(
      contracts.mainnet.weth
    ),
  ]
}

export const stake = (token: StakeToken): Permission[] => {
  const permissions: Permission[] = []

  switch (token.symbol) {
    case "AAVE":
      permissions.push(
        ...allowErc20Approve(
          [contracts.mainnet.aaveV2.aave],
          [contracts.mainnet.aaveV2.stkAave]
        ),
        allow.mainnet.aaveV2.stkAave.stake(c.avatar),
        allow.mainnet.aaveV2.stkAave.claimRewardsAndStake(c.avatar),
        allow.mainnet.aaveV2.stkAave.redeem(c.avatar),
        allow.mainnet.aaveV2.stkAave.cooldown(),
        allow.mainnet.aaveV2.stkAave.claimRewards(c.avatar)
      )
      break
    case "ABPTV2":
      permissions.push(
        ...allowErc20Approve(
          [contracts.mainnet.aaveV2.abptV2],
          [contracts.mainnet.aaveV2.stkAbptV2]
        ),
        allow.mainnet.aaveV2.stkAbptV2.stake(c.avatar),
        allow.mainnet.aaveV2.stkAbptV2.redeem(c.avatar),
        allow.mainnet.aaveV2.stkAbptV2.cooldown(),
        allow.mainnet.aaveV2.stkAbptV2.claimRewards(c.avatar)
      )
      break
    case "GHO":
      permissions.push(
        ...allowErc20Approve(
          [contracts.mainnet.aaveV2.gho],
          [contracts.mainnet.aaveV2.stkGho]
        ),
        allow.mainnet.aaveV2.stkGho.stake(c.avatar),
        allow.mainnet.aaveV2.stkGho.redeem(c.avatar),
        allow.mainnet.aaveV2.stkGho.cooldown(),
        allow.mainnet.aaveV2.stkGho.claimRewards(c.avatar)
      )
      break
  }

  return permissions
}

export const delegate = (token: DelegateToken, delegatee: string) => {
  const permissions = []

  switch (token.symbol) {
    case "AAVE":
      permissions.push(
        allow.mainnet.aaveV2.aave.delegate(delegatee),
        allow.mainnet.aaveV2.aave.delegateByType(delegatee)
      )
      break
    case "stkAAVE":
      permissions.push(
        allow.mainnet.aaveV2.stkAave.delegate(delegatee),
        allow.mainnet.aaveV2.stkAave.delegateByType(delegatee)
      )
      break
    case "aEthAAVE":
      permissions.push(
        allow.mainnet.aaveV2.aEthAave.delegate(delegatee),
        allow.mainnet.aaveV2.aEthAave.delegateByType(delegatee)
      )
      break
  }

  return permissions
}
