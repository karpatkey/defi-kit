import { allow } from "zodiac-roles-sdk/kit"
import { AVATAR } from "zodiac-roles-sdk"
import { Token } from "./types"
import { allowErc20Approve } from "../../../erc20"
import { contracts } from "../../../../eth-sdk/config"

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

export const depositToken = (token: Token) => {
  return [
    allowErc20Approve(
      [token.token],
      [contracts.mainnet.aaveV2.aaveLendingPoolV2]
    ),
    allow.mainnet.aaveV2.aaveLendingPoolV2.deposit(
      token.token,
      undefined,
      AVATAR,
      "0x"
    ),
    allow.mainnet.aaveV2.aaveLendingPoolV2.withdraw(
      token.token,
      undefined,
      AVATAR
    ),
    allow.mainnet.aaveV2.aaveLendingPoolV2.setUserUseReserveAsCollateral(
      token.token
    ),
  ]
}

export const depositEther = () => [
  allow.mainnet.aaveV2.wrappedTokenGatewayV2.depositETH(
    contracts.mainnet.aaveV2.aaveLendingPoolV2,
    AVATAR,
    "0x",
    { send: true }
  ),
  allow.mainnet.aaveV2.wrappedTokenGatewayV2.withdrawETH(
    contracts.mainnet.aaveV2.aaveLendingPoolV2,
    undefined,
    AVATAR
  ),
  allow.mainnet.aaveV2.aaveLendingPoolV2.setUserUseReserveAsCollateral(WETH),
]

export const borrowToken = (token: Token) => {
  return [
    allowErc20Approve(
      [token.token],
      [contracts.mainnet.aaveV2.aaveLendingPoolV2]
    ),
    allow.mainnet.aaveV2.aaveLendingPoolV2.borrow(
      token.token,
      undefined,
      undefined,
      "0x",
      AVATAR
    ),
    allow.mainnet.aaveV2.aaveLendingPoolV2.repay(
      token.token,
      undefined,
      undefined,
      AVATAR
    ),
  ]
}

export const borrowEther = () => {
  return [
    allow.mainnet.aaveV2.wrappedTokenGatewayV2.borrowETH(
      contracts.mainnet.aaveV2.aaveLendingPoolV2,
      undefined,
      undefined,
      "0x"
    ),
    allow.mainnet.aaveV2.wrappedTokenGatewayV2.repayETH(
      contracts.mainnet.aaveV2.aaveLendingPoolV2,
      undefined,
      undefined,
      "0x",
      { send: true }
    ),
  ]
}

export const stake = () => {
  return [
    allowErc20Approve(
      [contracts.mainnet.aaveV2.aave],
      [contracts.mainnet.aaveV2.stkaave]
    ),
    allowErc20Approve(
      [contracts.mainnet.aaveV2.abpt],
      [contracts.mainnet.aaveV2.stkabpt]
    ),
    allow.mainnet.aaveV2.stkaave.stake(AVATAR),
    allow.mainnet.aaveV2.stkabpt.stake(AVATAR),
    allow.mainnet.aaveV2.stkaave.redeem(AVATAR),
    allow.mainnet.aaveV2.stkabpt.redeem(AVATAR),
    allow.mainnet.aaveV2.stkaave.cooldown(),
    allow.mainnet.aaveV2.stkabpt.cooldown(),
    allow.mainnet.aaveV2.stkaave.claimRewards(AVATAR),
    allow.mainnet.aaveV2.stkabpt.claimRewards(AVATAR),
  ]
}
