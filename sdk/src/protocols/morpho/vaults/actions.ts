import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve } from "../../../conditions"
import { Permission } from "zodiac-roles-sdk"

import { Vault } from "./types"
import { c } from "zodiac-roles-sdk"

export const deposit = (vault: Vault): Permission[] => {
  return [
    // Approval for asset token
    ...allowErc20Approve([vault.asset.address], [vault.id]),

    // Deposit permission
    {
      ...allow.mainnet.morpho.vault.deposit(undefined, c.avatar),
      targetAddress: vault.id,
    },

    // Withdraw permission
    {
      ...allow.mainnet.morpho.vault.withdraw(undefined, c.avatar, c.avatar),
      targetAddress: vault.id,
    },

    // Redeem permission
    {
      ...allow.mainnet.morpho.vault.redeem(undefined, c.avatar, c.avatar),
      targetAddress: vault.id,
    },
  ]
}
