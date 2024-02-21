import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve } from "../../conditions"
import { contracts } from "../../../eth-sdk/config"

export const eth = {
  deposit: async () => [
    ...allowErc20Approve([contracts.mainnet.ankr.ankrETH], [contracts.mainnet.ankr.flashUnstake]),
    allow.mainnet.ankr.ETH2_Staking.stakeAndClaimAethC(
      { send: true }
    ),
    allow.mainnet.ankr.flashUnstake.swapEth(undefined, c.avatar),
    allow.mainnet.ankr.ETH2_Staking.unstakeAETH(),
  ]
}
