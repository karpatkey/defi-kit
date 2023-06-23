import { allow } from "zodiac-roles-sdk/kit"
import { AVATAR } from "zodiac-roles-sdk/index"
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
    )
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
  allow.mainnet.aaveV2.aaveLendingPoolV2.setUserUseReserveAsCollateral(
    WETH
  )
]
