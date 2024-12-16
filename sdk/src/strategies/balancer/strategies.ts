import { allow } from "zodiac-roles-sdk/kit"
import { c, PermissionSet } from "zodiac-roles-sdk"
import { Chain } from "../../types"
import { Pool } from "../../protocols/balancer/types"
import ethPools from "../../protocols/balancer/_ethPools"
import gnoPools from "../../protocols/balancer/_gnoPools"
import arb1Pools from "../../protocols/balancer/_arb1Pools"
import oethPools from "../../protocols/balancer/_oethPools"
import basePools from "../../protocols/balancer/_basePools"
import { findPool ,findTokenIndexInPool } from "../../protocols/balancer"
import { Address } from "@gnosis-guild/eth-sdk"

export enum ExitKind {
  single,
  proportional,
}

export const withdrawOptions = (
  chain: Chain,
  bpt: Address,
  exitKind?: ExitKind,
  exitTokenAddress?: Address
): PermissionSet => {
  const chainPoolsMap: Record<Chain, readonly Pool[]> = {
    [Chain.eth]: ethPools,
    [Chain.gno]: gnoPools,
    [Chain.arb1]: arb1Pools,
    [Chain.oeth]: oethPools,
    [Chain.base]: basePools,
  }

  let balancerPid
  let balancerPoolType

  switch (chain) {
    case Chain.eth:
      ({ id: balancerPid, type: balancerPoolType } = findPool(
        ethPools,
        bpt
      ))
      break
    case Chain.gno:
      ({ id: balancerPid, type: balancerPoolType } = findPool(
        gnoPools,
        bpt
      ))
      break
    case Chain.arb1:
      ({ id: balancerPid, type: balancerPoolType } = findPool(
        arb1Pools,
        bpt
      ))
      break
    case Chain.oeth:
      ({ id: balancerPid, type: balancerPoolType } = findPool(
        oethPools,
        bpt
      ))
      break
    case Chain.base:
      ({ id: balancerPid, type: balancerPoolType } = findPool(
        basePools,
        bpt
      ))
      break
  }

  const permissions: PermissionSet = []

  if (exitKind === ExitKind.single) {
    if (!exitTokenAddress) {
      throw new Error("exitTokenAddress must be specified for single token exits.");
    }

    permissions.push(
      // It doesn't matter the blockchain we use, as the Vault address remains the same
      allow.mainnet.balancer.vault.exitPool(balancerPid, c.avatar, c.avatar, {
        userData: c.abiEncodedMatches(
          [0, undefined, findTokenIndexInPool(chainPoolsMap[chain], bpt, exitTokenAddress)],
          ["uint256", "uint256", "uint256"]
        ),
      })
    )
  } else if (exitKind === ExitKind.proportional) {
    permissions.push(
      // It doesn't matter the blockchain we use, as the Vault address remains the same
      allow.mainnet.balancer.vault.exitPool(balancerPid, c.avatar, c.avatar, {
        userData: c.abiEncodedMatches(
          balancerPoolType === "ComposableStable" ? [2] : [1],
          ["uint256"]
        ),
      })
    )
  } else {
    // Default case when `exitKind` is not specified
    permissions.push(
      allow.mainnet.balancer.vault.exitPool(balancerPid, c.avatar, c.avatar)
    )
  }

  return permissions
}