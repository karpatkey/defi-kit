import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve } from "../../conditions"
import { contracts } from "../../../eth-sdk/config"

export const eth = {
  deposit: async () => [
    ...allowErc20Approve(
      [contracts.mainnet.stader.ETHx],
      [contracts.mainnet.stader.user_withdraw_manager]
    ),
    allow.mainnet.stader.staking_pool_manager["deposit(address)"](c.avatar, {
      send: true,
    }),
    allow.mainnet.stader.user_withdraw_manager[
      "requestWithdraw(uint256,address)"
    ](undefined, c.avatar),
    allow.mainnet.stader.user_withdraw_manager.claim(),
  ],
}
