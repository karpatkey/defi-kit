import { allow } from "zodiac-roles-sdk/kit"
import { Permission, c } from "zodiac-roles-sdk"
import { Token } from "./types"
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
      ...allowErc20Approve([token.token], [contracts.mainnet.aaveV2.poolV2])
    )
  }

  permissions.push(
    allow.mainnet.aaveV2.poolV2.deposit(token.token, undefined, c.avatar),
    allow.mainnet.aaveV2.poolV2.withdraw(token.token, undefined, c.avatar),
    allow.mainnet.aaveV2.poolV2.setUserUseReserveAsCollateral(token.token)
  )

  return permissions
}

export const depositEther = () => [
  allow.mainnet.aaveV2.wrappedTokenGatewayV2.depositETH(
    contracts.mainnet.aaveV2.poolV2,
    c.avatar,
    undefined,
    { send: true }
  ),
  ...allowErc20Approve(
    [contracts.mainnet.aaveV2.aWeth],
    [contracts.mainnet.aaveV2.wrappedTokenGatewayV2]
  ),
  allow.mainnet.aaveV2.wrappedTokenGatewayV2.withdrawETH(
    contracts.mainnet.aaveV2.poolV2,
    undefined,
    c.avatar
  ),
  allow.mainnet.aaveV2.poolV2.setUserUseReserveAsCollateral(
    contracts.mainnet.weth
  ),
]

export const borrowToken = (token: Token) => {
  return [
    ...allowErc20Approve([token.token], [contracts.mainnet.aaveV2.poolV2]),
    allow.mainnet.aaveV2.poolV2.borrow(
      token.token,
      undefined,
      undefined,
      undefined,
      c.avatar
    ),
    allow.mainnet.aaveV2.poolV2.repay(
      token.token,
      undefined,
      undefined,
      c.avatar
    ),
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
      contracts.mainnet.aaveV2.poolV2
    ),
    allow.mainnet.aaveV2.wrappedTokenGatewayV2.repayETH(
      contracts.mainnet.aaveV2.poolV2,
      undefined,
      undefined,
      c.avatar,
      { send: true }
    ),
  ]
}
