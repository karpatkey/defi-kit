import { c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve } from "../../conditions"
import { contracts } from "../../../eth-sdk/config"

export const eth = {
  deposit: async () => [
    ...allowErc20Approve(
      [contracts.mainnet.lido.stEth],
      [contracts.mainnet.lido.wstEth]
    ),
    ...allowErc20Approve(
      [contracts.mainnet.lido.stEth, contracts.mainnet.lido.wstEth],
      [contracts.mainnet.lido.unstEth]
    ),
    allow.mainnet.lido.wstEth.wrap(),
    allow.mainnet.lido.wstEth.unwrap(),
    allow.mainnet.lido.stEth.submit(undefined, { send: true }),
    // Request stETH Withdrawal - Locks your stETH in the queue. In exchange you receive an NFT, that represents your position
    // in the queue
    allow.mainnet.lido.unstEth.requestWithdrawals(undefined, c.avatar),

    // Request wstETH Withdrawal - Transfers the wstETH to the unstETH to be burned in exchange for stETH. Then it locks your stETH
    // in the queue. In exchange you receive an NFT, that represents your position in the queue
    allow.mainnet.lido.unstEth.requestWithdrawalsWstETH(undefined, c.avatar),

    // Claim ETH - Once the request is finalized by the oracle report and becomes claimable,
    // this function claims your ether and burns the NFT
    allow.mainnet.lido.unstEth.claimWithdrawal(),
    allow.mainnet.lido.unstEth.claimWithdrawals(),
  ],
}
