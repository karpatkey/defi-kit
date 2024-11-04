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
        [contracts.mainnet.rocketPool.rEth],
        [contracts.mainnet.rocketPool.swapRouter]
      ),
      {
        ...allow.mainnet.rocketPool.depositPool.deposit(),
        send: true,
        // The Deposit Pool address can change so it's replaced dynamically
        targetAddress: deposit_pool,
      },
      allow.mainnet.rocketPool.rEth.burn(),
      {
        ...allow.mainnet.rocketPool.swapRouter.swapTo(),
        send: true,
      },
      allow.mainnet.rocketPool.swapRouter.swapFrom(),
    ]

    return permissions
  },
}
