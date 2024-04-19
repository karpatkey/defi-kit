import { allow } from "zodiac-roles-sdk/kit"
import { c, Permission } from "zodiac-roles-sdk"
import { Token } from "./types"
import { allowErc20Approve } from "../../conditions"
import { contracts } from "../../../eth-sdk/config"

export const depositDsr = (): Permission[] => {
  return [
    ...allowErc20Approve(
      [contracts.mainnet.dai],
      [contracts.mainnet.spark.sDAI]
    ),
    allow.mainnet.spark.sDAI.deposit(undefined, c.avatar),
    allow.mainnet.spark.sDAI.redeem(undefined, c.avatar, c.avatar),
  ]
}

export const depositToken = (token: Token) => {
  return [
    ...allowErc20Approve(
      [token.token],
      [contracts.mainnet.spark.sparkLendingPoolV3]
    ),
    allow.mainnet.spark.sparkLendingPoolV3.supply(
      token.token,
      undefined,
      c.avatar
    ),
    allow.mainnet.spark.sparkLendingPoolV3.withdraw(
      token.token,
      undefined,
      c.avatar
    ),
    allow.mainnet.spark.sparkLendingPoolV3.setUserUseReserveAsCollateral(
      token.token
    ),
  ]
}

export const depositEther = () => [
  ...allowErc20Approve(
    [contracts.mainnet.spark.spWETH],
    [contracts.mainnet.spark.wrappedTokenGatewayV3]
  ),
  allow.mainnet.spark.wrappedTokenGatewayV3.depositETH(
    contracts.mainnet.spark.sparkLendingPoolV3,
    c.avatar,
    undefined,
    { send: true }
  ),
  allow.mainnet.spark.wrappedTokenGatewayV3.withdrawETH(
    contracts.mainnet.spark.sparkLendingPoolV3,
    undefined,
    c.avatar
  ),
  allow.mainnet.spark.sparkLendingPoolV3.setUserUseReserveAsCollateral(
    contracts.mainnet.weth
  ),
]

export const borrowToken = (token: Token) => {
  return [
    ...allowErc20Approve(
      [token.token],
      [contracts.mainnet.spark.sparkLendingPoolV3]
    ),
    allow.mainnet.spark.sparkLendingPoolV3.borrow(
      token.token,
      undefined,
      undefined,
      undefined,
      c.avatar
    ),
    allow.mainnet.spark.sparkLendingPoolV3.repay(
      token.token,
      undefined,
      undefined,
      c.avatar
    ),
    // Spark has only made available the borrow action with interestRateModel = 2 (Variable Debt)
    // allow.mainnet.spark.sparkLendingPoolV3.swapBorrowRateMode(token.token),
  ]
}

export const borrowEther = () => {
  return [
    allow.mainnet.spark.variableDebtWETH.approveDelegation(
      contracts.mainnet.spark.wrappedTokenGatewayV3
    ),
    // Spark has only made available the borrow action with interestRateModel = 2 (Variable Debt)
    // allow.mainnet.spark.stableDebtWETH.approveDelegation(
    //   contracts.mainnet.spark.wrappedTokenGatewayV3
    // ),
    allow.mainnet.spark.wrappedTokenGatewayV3.borrowETH(
      contracts.mainnet.spark.sparkLendingPoolV3
    ),
    allow.mainnet.spark.wrappedTokenGatewayV3.repayETH(
      contracts.mainnet.spark.sparkLendingPoolV3,
      undefined,
      undefined,
      c.avatar,
      { send: true }
    ),
    // Spark has only made available the borrow action with interestRateModel = 2 (Variable Debt)
    // allow.mainnet.spark.sparkLendingPoolV3.swapBorrowRateMode(WETH),
  ]
}
