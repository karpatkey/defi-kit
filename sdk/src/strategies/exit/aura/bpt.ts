import { allow } from "zodiac-roles-sdk/kit"
import { Pool } from "../../../protocols/aura/types"

export const bpt = (pool: Pool) => {
  return [
    {
      ...allow.mainnet.aura.rewarder.withdrawAndUnwrap(),
      targetAddress: pool.rewarder,
    },
  ]
}
