import { Permission } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve } from "../../conditions"
import { contracts } from "../../../eth-sdk/config"
import { queryDepositPool } from "./utils"

export const eth = {
  deposit: async () => {
    const deposit_pool = await queryDepositPool()

    const permissions: Permission[] = [
      ...allowErc20Approve(
        [contracts.mainnet.rocket_pool.rETH],
        [contracts.mainnet.rocket_pool.swap_router]
      ),
      {
        ...allow.mainnet.rocket_pool.deposit_pool.deposit(),
        send: true,
        // The Deposit Pool address can change so it's replaced dynamically
        targetAddress: deposit_pool,
      },
      allow.mainnet.rocket_pool.rETH.burn(),
      {
        ...allow.mainnet.rocket_pool.swap_router.swapTo(),
        send: true,
      },
      allow.mainnet.rocket_pool.swap_router.swapFrom(),
    ]

    return permissions
  },
}
