import { allow } from "zodiac-roles-sdk/kit"
import { AVATAR } from "zodiac-roles-sdk/index"
import { Token } from "./types"
import { allowErc20Approve } from "../../../erc20"
import { contracts } from "../../../../eth-sdk/config"

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
  ]
}

export const depositEther = () => [
  allow.mainnet.aaveV2.wrappedTokenGatewayV2.depositETH(
    contracts.mainnet.aaveV2.aaveLendingPoolV2,
    AVATAR,
    "0x",
    { send: true }
  ),
]
