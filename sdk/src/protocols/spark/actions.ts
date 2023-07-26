import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { Token } from "./types"
import { allowErc20Approve } from "../../erc20"
import { contracts } from "../../../eth-sdk/config"

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const DAI = "0x6b175474e89094c44da98b954eedeac495271d0f"

export const depositToken = (token: Token) => {
  return [
    ...allowErc20Approve(
      [token.token],
      [contracts.mainnet.spark.sparkLendingPoolV3]
    ),
    allow.mainnet.spark.sparkLendingPoolV3.supply(
      token.token,
      undefined,
      c.avatar,
      "0x"
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
  allow.mainnet.spark.wrappedTokenGatewayV3.depositETH(
    contracts.mainnet.spark.sparkLendingPoolV3,
    c.avatar,
    "0x",
    { send: true }
  ),
  allow.mainnet.spark.wrappedTokenGatewayV3.withdrawETH(
    contracts.mainnet.spark.sparkLendingPoolV3,
    undefined,
    c.avatar
  ),
  allow.mainnet.spark.sparkLendingPoolV3.setUserUseReserveAsCollateral(WETH),
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
      "0x",
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
      contracts.mainnet.spark.sparkLendingPoolV3,
      undefined,
      undefined,
      "0x"
    ),
    allow.mainnet.spark.wrappedTokenGatewayV3.repayETH(
      contracts.mainnet.spark.sparkLendingPoolV3,
      undefined,
      undefined,
      "0x",
      { send: true }
    ),
    // Spark has only made available the borrow action with interestRateModel = 2 (Variable Debt)
    // allow.mainnet.spark.sparkLendingPoolV3.swapBorrowRateMode(WETH),
  ]
}

export const sDAI = () => {
  return [
    ...allowErc20Approve(
      [DAI],
      [contracts.mainnet.spark.sDAI]
    ),
    allow.mainnet.spark.sDAI.deposit(
      undefined,
      c.avatar
    ),
    allow.mainnet.spark.sDAI.redeem(
      undefined,
      c.avatar,
      c.avatar
    )
  ]
}
