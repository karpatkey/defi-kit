import { allow } from "zodiac-roles-sdk/kit"
import { c, PermissionSet } from "zodiac-roles-sdk"
import { Chain } from "../../types"
import { Rewarder } from "../../protocols/aura/types"
import ethAuraPools from "../../protocols/aura/_ethPools"
import gnoAuraPools from "../../protocols/aura/_gnoPools"
import arb1AuraPools from "../../protocols/aura/_arb1Pools"
import oethAuraPools from "../../protocols/aura/_oethPools"
import baseAuraPools from "../../protocols/aura/_basePools"
import ethBalancerPools from "../../protocols/balancer/_ethPools"
import gnoBalancerPools from "../../protocols/balancer/_gnoPools"
import arb1BalancerPools from "../../protocols/balancer/_arb1Pools"
import oethBalancerPools from "../../protocols/balancer/_oethPools"
import baseBalancerPools from "../../protocols/balancer/_basePools"
import { findPool as findAuraPool } from "../../protocols/aura"
import { findPool as findBalancerPool } from "../../protocols/balancer"

export enum ExitKind {
  single,
  proportional,
}

export const withdraw = (rewarder: Rewarder) => {
  return [
    {
      ...allow.mainnet.aura.rewarder.withdrawAndUnwrap(),
      targetAddress: rewarder,
    },
  ]
}

export const withdraw_balancer = (
  chain: Chain,
  rewarder: Rewarder,
  exitKind?: ExitKind
): PermissionSet => {
  let bpt
  let balancerPid
  let balancerPoolType
  switch (chain) {
    case Chain.eth:
      bpt = findAuraPool(ethAuraPools, rewarder).bpt
      ;({ id: balancerPid, type: balancerPoolType } = findBalancerPool(
        ethBalancerPools,
        bpt
      ))
      break
    case Chain.gno:
      bpt = findAuraPool(gnoAuraPools, rewarder).bpt
      ;({ id: balancerPid, type: balancerPoolType } = findBalancerPool(
        gnoBalancerPools,
        bpt
      ))
      break
    case Chain.arb1:
      bpt = findAuraPool(arb1AuraPools, rewarder).bpt
      ;({ id: balancerPid, type: balancerPoolType } = findBalancerPool(
        arb1BalancerPools,
        bpt
      ))
      break
    case Chain.oeth:
      bpt = findAuraPool(oethAuraPools, rewarder).bpt
      ;({ id: balancerPid, type: balancerPoolType } = findBalancerPool(
        oethBalancerPools,
        bpt
      ))
      break
    case Chain.base:
      bpt = findAuraPool(baseAuraPools, rewarder).bpt
      ;({ id: balancerPid, type: balancerPoolType } = findBalancerPool(
        baseBalancerPools,
        bpt
      ))
      break
  }

  const permissions: PermissionSet = [
    // It doesn't matter the blockchain we use, since we are overwriting
    // the address of the rewarder (abis are the same indistinctively of the blockchain)
    {
      ...allow.mainnet.aura.rewarder["withdrawAndUnwrap"](),
      targetAddress: rewarder,
    },
  ]

  if (balancerPoolType === "ComposableStable") {
    permissions.push(
      // It doesn't matter the blockchain we use, as the Vault address remains the same
      allow.mainnet.balancer.vault.exitPool(balancerPid, c.avatar, c.avatar, {
        userData: c.abiEncodedMatches(
          exitKind === ExitKind.single
            ? [0]
            : exitKind === ExitKind.proportional
            ? [2]
            : [undefined],
          ["uint256"]
        ),
      })
    )
  } else {
    permissions.push(
      // It doesn't matter the blockchain we use, as the Vault address remains the same
      allow.mainnet.balancer.vault.exitPool(balancerPid, c.avatar, c.avatar, {
        userData: c.abiEncodedMatches(
          exitKind === ExitKind.single
            ? [0]
            : exitKind === ExitKind.proportional
            ? [1]
            : [undefined],
          ["uint256"]
        ),
      })
    )
  }

  return permissions
}


