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
        [contracts.mainnet.aaveV2.aWETH],
        [contracts.mainnet.aaveV2.wrappedTokenGatewayV2]
      )
    )
  } else {
    permissions.push(
      ...allowErc20Approve(
        [token.token],
        [contracts.mainnet.aaveV2.aaveLendingPoolV2]
      )
    )
  }

  permissions.push(
    allow.mainnet.aaveV2.aaveLendingPoolV2.deposit(
      token.token,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV2.aaveLendingPoolV2.withdraw(
      token.token,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV2.aaveLendingPoolV2.setUserUseReserveAsCollateral(
      token.token
    )
  )

  return permissions
}

export const depositEther = () => [
  allow.mainnet.aaveV2.wrappedTokenGatewayV2.depositETH(
    contracts.mainnet.aaveV2.aaveLendingPoolV2,
    c.avatar,
    undefined,
    { send: true }
  ),
  ...allowErc20Approve(
    [contracts.mainnet.aaveV2.aWETH],
    [contracts.mainnet.aaveV2.wrappedTokenGatewayV2]
  ),
  allow.mainnet.aaveV2.wrappedTokenGatewayV2.withdrawETH(
    contracts.mainnet.aaveV2.aaveLendingPoolV2,
    undefined,
    c.avatar
  ),
  allow.mainnet.aaveV2.aaveLendingPoolV2.setUserUseReserveAsCollateral(
    contracts.mainnet.weth
  ),
]

export const borrowToken = (token: Token) => {
  return [
    ...allowErc20Approve(
      [token.token],
      [contracts.mainnet.aaveV2.aaveLendingPoolV2]
    ),
    allow.mainnet.aaveV2.aaveLendingPoolV2.borrow(
      token.token,
      undefined,
      undefined,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV2.aaveLendingPoolV2.repay(
      token.token,
      undefined,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV2.aaveLendingPoolV2.swapBorrowRateMode(token.token),
  ]
}

export const borrowEther = () => {
  return [
    allow.mainnet.aaveV2.variableDebtWETH.approveDelegation(
      contracts.mainnet.aaveV2.wrappedTokenGatewayV2
    ),
    allow.mainnet.aaveV2.stableDebtWETH.approveDelegation(
      contracts.mainnet.aaveV2.wrappedTokenGatewayV2
    ),
    allow.mainnet.aaveV2.wrappedTokenGatewayV2.borrowETH(
      contracts.mainnet.aaveV2.aaveLendingPoolV2
    ),
    allow.mainnet.aaveV2.wrappedTokenGatewayV2.repayETH(
      contracts.mainnet.aaveV2.aaveLendingPoolV2,
      undefined,
      undefined,
      c.avatar,
      { send: true }
    ),
    allow.mainnet.aaveV2.aaveLendingPoolV2.swapBorrowRateMode(
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
          [contracts.mainnet.aaveV2.stkaave]
        ),
        allow.mainnet.aaveV2.stkaave.stake(c.avatar),
        allow.mainnet.aaveV2.stkaave.claimRewardsAndStake(c.avatar),
        allow.mainnet.aaveV2.stkaave.redeem(c.avatar),
        allow.mainnet.aaveV2.stkaave.cooldown(),
        allow.mainnet.aaveV2.stkaave.claimRewards(c.avatar)
      )
      break
    case "ABPT":
      permissions.push(
        ...allowErc20Approve(
          [contracts.mainnet.aaveV2.abpt],
          [contracts.mainnet.aaveV2.stkabpt]
        ),
        allow.mainnet.aaveV2.stkabpt.stake(c.avatar),
        allow.mainnet.aaveV2.stkabpt.redeem(c.avatar),
        allow.mainnet.aaveV2.stkabpt.cooldown(),
        allow.mainnet.aaveV2.stkabpt.claimRewards(c.avatar)
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
        allow.mainnet.aaveV2.stkaave.delegate(delegatee),
        allow.mainnet.aaveV2.stkaave.delegateByType(delegatee)
      )
      break
    case "aEthAAVE":
      permissions.push(
        allow.mainnet.aaveV2.aEthAAVE.delegate(delegatee),
        allow.mainnet.aaveV2.aEthAAVE.delegateByType(delegatee)
      )
      break
  }

  return permissions
}
