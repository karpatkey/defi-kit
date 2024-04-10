import { findPool } from "../../../protocols/aura"
import ethPools from "../../../protocols/aura/_ethPools"
import gnoPools from "../../../protocols/aura/_gnoPools"
import { EthPool, GnoPool } from "../../../protocols/aura/types"
import { aura_one_sided } from "./aura_one_sided"
import { aura_proportional } from "./aura_proportional"

export const eth = {
  aura_proportional: async ({
    pools,
  }: {
    pools: (EthPool["name"] | EthPool["bpt"] | EthPool["id"])[]
  }) => pools.flatMap((pool) => aura_proportional(findPool(ethPools, pool))),

  //   aura_one_sided: (config: {
  //     pools: (EthPool["name"] | EthPool["bpt"] | EthPool["id"])[]
  //   }) => aura_one_sided(),
}

export const gno = {
  aura_proportional: async ({
    pools,
  }: {
    pools: (GnoPool["name"] | GnoPool["bpt"] | GnoPool["id"])[]
  }) => pools.flatMap((pool) => aura_proportional(findPool(gnoPools, pool))),

  //   aura_one_sided: (config: { pools: GnoPool[] }) => aura_one_sided(config),
}
