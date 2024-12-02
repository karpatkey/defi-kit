import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve } from "../../conditions"
import { contracts } from "../../../eth-sdk/config"

export const eth = {
  deposit: async () => [
    ...allowErc20Approve(
      [contracts.mainnet.stader.ethx],
      [contracts.mainnet.stader.userWithdrawManager]
    ),
    allow.mainnet.stader.stakingPoolManager["deposit(address)"](c.avatar, {
      send: true,
    }),
    allow.mainnet.stader.stakingPoolManager["deposit(address,string)"](
      c.avatar,
      undefined,
      { send: true }
    ),
    allow.mainnet.stader.userWithdrawManager[
      "requestWithdraw(uint256,address)"
    ](undefined, c.avatar),
    allow.mainnet.stader.userWithdrawManager.claim(),
  ],
}
