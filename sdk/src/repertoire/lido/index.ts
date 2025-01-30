import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve } from "../../conditions"
import { contracts } from "../../../eth-sdk/config"

export const eth = {
  unstake_stETH: async () => {
    return [
      ...allowErc20Approve(
        [contracts.mainnet.lido.stEth],
        [contracts.mainnet.lido.unstEth]
      ),
      allow.mainnet.lido.unstEth.requestWithdrawals(undefined, c.avatar),
    ]
  },

  unwrap_and_unstake_wstETH: async () => {
    return [
      ...allowErc20Approve(
        [contracts.mainnet.lido.wstEth],
        [contracts.mainnet.lido.unstEth]
      ),
      allow.mainnet.lido.unstEth.requestWithdrawalsWstETH(undefined, c.avatar),
    ]
  },
}
