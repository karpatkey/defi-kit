import { Permission, c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { Pool } from "../../protocols/aura/types"

export const underlying_single = (pool: Pool, balancerPoolId: string) => {
  return [
    {
      ...allow.mainnet.aura.rewarder.withdrawAndUnwrap(),
      targetAddress: pool.rewarder,
    },
    allow.mainnet.balancer.vault.exitPool(balancerPoolId, c.avatar, c.avatar),
  ]
}
