import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve } from "../../erc20"
import { contracts } from "../../../eth-sdk/config"
import { AVATAR } from "zodiac-roles-sdk/index"

export const eth = {
  deposit: () => [
    ...allowErc20Approve(
      [contracts.mainnet.lido.steth],
      [contracts.mainnet.lido.wsteth]
    ),
    ...allowErc20Approve(
      [contracts.mainnet.lido.steth, contracts.mainnet.lido.wsteth],
      [contracts.mainnet.lido.unsteth]
    ),
    allow.mainnet.lido.wsteth.wrap(),
    allow.mainnet.lido.wsteth.unwrap(),
    allow.mainnet.lido.steth.submit(undefined, { send: true }),
    // Request stETH Withdrawal - Locks your stETH in the queue. In exchange you receive an NFT, that represents your position
    // in the queue
    allow.mainnet.lido.unsteth.requestWithdrawals(undefined, AVATAR),
    // When the unstETH has no allowance over the owner's stETH
    allow.mainnet.lido.unsteth.requestWithdrawalsWithPermit(undefined, AVATAR),

    // Request wstETH Withdrawal - Transfers the wstETH to the unstETH to be burned in exchange for stETH. Then it locks your stETH
    // in the queue. In exchange you receive an NFT, that represents your position in the queue
    allow.mainnet.lido.unsteth.requestWithdrawals(undefined, AVATAR),
    // When the unstETH has no allowance over the owner's wstETH
    allow.mainnet.lido.unsteth.requestWithdrawalsWstETHWithPermit(
      undefined,
      AVATAR
    ),

    // Claim ETH - Once the request is finalized by the oracle report and becomes claimable, 
    // this function claims your ether and burns the NFT
    allow.mainnet.lido.unsteth.claimWithdrawal(),
    allow.mainnet.lido.unsteth.claimWithdrawals()
  ],
}
