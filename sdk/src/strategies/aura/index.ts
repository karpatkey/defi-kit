import { findPool } from "../../protocols/aura"
import { findPool as findBalancerPool } from "../../protocols/balancer"
import ethPools from "../../protocols/aura/_ethPools"
import gnoPools from "../../protocols/aura/_gnoPools"
import ethBalancerPools from "../../protocols/balancer/_ethPools"
import gnoBalancerPools from "../../protocols/balancer/_gnoPools"
import { EthPool, GnoPool } from "../../protocols/aura/types"
import { underlying_single } from "./underlying_single"
import { bpt } from "./bpt"

export const eth = {
  /**
   * Withdraw BPT from the specified Aura pool
   */
  bpt: async ({
    pools,
  }: {
    pools: (EthPool["name"] | EthPool["bpt"] | EthPool["id"])[]
  }) => pools.flatMap((pool) => bpt(findPool(ethPools, pool))),

  underlying_single: async ({
    pools,
  }: {
    pools: (EthPool["name"] | EthPool["bpt"] | EthPool["id"])[]
  }) =>
    pools.flatMap((pool) => {
      const auraPool = findPool(ethPools, pool)
      const balancerPool = findBalancerPool(ethBalancerPools, auraPool.bpt)
      return underlying_single(auraPool, balancerPool.id)
    }),
}

export const gno = {
  /**
   * Withdraw BPT from the specified Aura pool
   */
  bpt: async ({
    pools,
  }: {
    pools: (GnoPool["name"] | GnoPool["bpt"] | GnoPool["id"])[]
  }) => pools.flatMap((pool) => bpt(findPool(gnoPools, pool))),

  underlying_single: async ({
    pools,
  }: {
    pools: (GnoPool["name"] | GnoPool["bpt"] | GnoPool["id"])[]
  }) =>
    pools.flatMap((pool) => {
      const auraPool = findPool(gnoPools, pool)
      const balancerPool = findBalancerPool(gnoBalancerPools, auraPool.bpt)
      return underlying_single(auraPool, balancerPool.id)
    }),
}
