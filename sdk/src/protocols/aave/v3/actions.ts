import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { Token } from "./types"
import { allowErc20Approve } from "../../../erc20"
import { contracts } from "../../../../eth-sdk/config"

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

export const depositToken = (token: Token) => {
  const permissions = [
    ...allowErc20Approve(
      [token.token],
      [contracts.mainnet.aaveV3.aaveLendingPoolV3]
    ),
    allow.mainnet.aaveV3.aaveLendingPoolV3.supply(
      token.token,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV3.aaveLendingPoolV3.withdraw(
      token.token,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV3.aaveLendingPoolV3.setUserUseReserveAsCollateral(
      token.token
    ),
  ]

  if (token.symbol === "WETH") {
    permissions.push(
      ...allowErc20Approve(
        [contracts.mainnet.aaveV3.aEthWETH],
        [contracts.mainnet.aaveV3.wrappedTokenGatewayV3]
      )
    )
  }

  return permissions
}

export const depositEther = () => [
  ...allowErc20Approve(
    [contracts.mainnet.aaveV3.aEthWETH],
    [contracts.mainnet.aaveV3.wrappedTokenGatewayV3]
  ),
  allow.mainnet.aaveV3.wrappedTokenGatewayV3.depositETH(
    contracts.mainnet.aaveV3.aaveLendingPoolV3,
    c.avatar,
    undefined,
    { send: true }
  ),
  allow.mainnet.aaveV3.wrappedTokenGatewayV3.withdrawETH(
    contracts.mainnet.aaveV3.aaveLendingPoolV3,
    undefined,
    c.avatar
  ),
  allow.mainnet.aaveV3.aaveLendingPoolV3.setUserUseReserveAsCollateral(WETH),
]

export const borrowToken = (token: Token) => {
  return [
    ...allowErc20Approve(
      [token.token],
      [contracts.mainnet.aaveV3.aaveLendingPoolV3]
    ),
    allow.mainnet.aaveV3.aaveLendingPoolV3.borrow(
      token.token,
      undefined,
      undefined,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV3.aaveLendingPoolV3.repay(
      token.token,
      undefined,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV3.aaveLendingPoolV3.swapBorrowRateMode(token.token),
  ]
}

export const borrowEther = () => {
  return [
    allow.mainnet.aaveV3.variableDebtWETH.approveDelegation(
      contracts.mainnet.aaveV3.wrappedTokenGatewayV3
    ),
    allow.mainnet.aaveV3.stableDebtWETH.approveDelegation(
      contracts.mainnet.aaveV3.wrappedTokenGatewayV3
    ),
    allow.mainnet.aaveV3.wrappedTokenGatewayV3.borrowETH(
      contracts.mainnet.aaveV3.aaveLendingPoolV3
    ),
    allow.mainnet.aaveV3.wrappedTokenGatewayV3.repayETH(
      contracts.mainnet.aaveV3.aaveLendingPoolV3,
      undefined,
      undefined,
      c.avatar,
      { send: true }
    ),
    allow.mainnet.aaveV3.aaveLendingPoolV3.swapBorrowRateMode(WETH),
  ]
}
