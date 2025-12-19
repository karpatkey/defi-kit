import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve } from "../../conditions"
import { Permission } from "zodiac-roles-sdk"

import { EthVault } from "./types"
import { c } from "zodiac-roles-sdk"

export const deposit = (vault: EthVault): Permission[] => {
  return [
    // Approval for asset token
    ...allowErc20Approve([vault.asset.address], [vault.id]),

    // Deposit permissions
    {
      ...allow.mainnet.gearbox.vault.deposit(undefined, c.avatar),
      targetAddress: vault.id,
    },
    // This is the function called by the UI
    {
      ...allow.mainnet.gearbox.vault.depositWithReferral(undefined, c.avatar),
      targetAddress: vault.id,
    },

    // Withdraw permission
    {
      ...allow.mainnet.gearbox.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: vault.id,
    },

    // Redeem permission
    {
      ...allow.mainnet.gearbox.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: vault.id,
    },
  ]
}
