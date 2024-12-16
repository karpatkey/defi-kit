import { allow } from "zodiac-roles-sdk/kit"
import { PermissionSet } from "zodiac-roles-sdk"
import { Chain } from "../../types"
//import { Rewarder } from "../../protocols/aura/types"
import ethAuraPools from "../../protocols/aura/_ethPools"
import gnoAuraPools from "../../protocols/aura/_gnoPools"
import arb1AuraPools from "../../protocols/aura/_arb1Pools"
import oethAuraPools from "../../protocols/aura/_oethPools"
import baseAuraPools from "../../protocols/aura/_basePools"
import { findPool as findAuraPool } from "../../protocols/aura"
import { ExitKind, withdrawOptions as balancerWithdrawOptions } from "../balancer/strategies"
import { Address } from "@gnosis-guild/eth-sdk"

export const withdrawOptions = (
  rewarder: Address,
  exitBalancer: boolean = false,
  chain?: Chain,
  exitKind?: ExitKind,
  exitTokenAddress?: Address
): PermissionSet => {
  const permissions: PermissionSet = [
    // It doesn't matter the blockchain we use, since we are overwriting
    // the address of the rewarder (abis are the same indistinctively of the blockchain)
    {
      ...allow.mainnet.aura.rewarder["withdrawAndUnwrap"](),
      targetAddress: rewarder,
    },
  ]

  if (exitBalancer) {
    let bpt
    switch (chain) {
      case Chain.eth:
        bpt = findAuraPool(ethAuraPools, rewarder).bpt
        permissions.push(
          ...balancerWithdrawOptions(Chain.eth, bpt, exitKind, exitTokenAddress)
        )
        break
      case Chain.gno:
        bpt = findAuraPool(gnoAuraPools, rewarder).bpt
        permissions.push(
          ...balancerWithdrawOptions(Chain.gno, bpt, exitKind, exitTokenAddress)
        )
        break
      case Chain.arb1:
        bpt = findAuraPool(arb1AuraPools, rewarder).bpt
        permissions.push(
          ...balancerWithdrawOptions(Chain.arb1, bpt, exitKind, exitTokenAddress)
        )
        break
      case Chain.oeth:
        bpt = findAuraPool(oethAuraPools, rewarder).bpt
        permissions.push(
          ...balancerWithdrawOptions(Chain.oeth, bpt, exitKind, exitTokenAddress)
        )
        break
      case Chain.base:
        bpt = findAuraPool(baseAuraPools, rewarder).bpt
        permissions.push(
          ...balancerWithdrawOptions(Chain.base, bpt, exitKind, exitTokenAddress)
        )
        break
    }
  }

  return permissions
}
