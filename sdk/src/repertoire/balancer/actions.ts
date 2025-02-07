import { allow } from "zodiac-roles-sdk/kit"
import { c, PermissionSet } from "zodiac-roles-sdk"
import { Chain } from "../../types"
import { Pool } from "../../protocols/balancer/types"
import ethPools from "../../protocols/balancer/_ethPools"
import gnoPools from "../../protocols/balancer/_gnoPools"
import arb1Pools from "../../protocols/balancer/_arb1Pools"
import oethPools from "../../protocols/balancer/_oethPools"
import basePools from "../../protocols/balancer/_basePools"
import {
  findPool,
  findTokenIndexInPool,
  findPoolByGauge,
} from "../../protocols/balancer"

export enum ExitKind {
  single,
  proportional,
}

export const withdrawOptions = (
  chain: Chain,
  bpt?: `0x${string}`,
  exitKind?: ExitKind,
  exitTokenAddress?: `0x${string}`,
  gauge?: `0x${string}`
): PermissionSet => {
  const chainPoolsMap: Record<Chain, readonly Pool[]> = {
    [Chain.eth]: ethPools,
    [Chain.gno]: gnoPools,
    [Chain.arb1]: arb1Pools,
    [Chain.oeth]: oethPools,
    [Chain.base]: basePools,
  }

  let pId: string
  let poolType: string

  if (bpt) {
    ;({ id: pId, type: poolType } = findPool(chainPoolsMap[chain], bpt))
  } else if (gauge) {
    ;({
      bpt: bpt,
      id: pId,
      type: poolType,
    } = findPoolByGauge(chainPoolsMap[chain], gauge))
  } else {
    throw new Error("Either `bpt` or `gauge` must be specified.")
  }

  const permissions: PermissionSet = []

  if (exitKind === ExitKind.single) {
    if (!exitTokenAddress) {
      throw new Error(
        "`exitTokenAddress` must be specified for single token exits."
      )
    }

    permissions.push(
      // It doesn't matter the blockchain we use, as the Vault address remains the same
      allow.mainnet.balancer.vault.exitPool(pId, c.avatar, c.avatar, {
        userData: c.abiEncodedMatches(
          [
            0,
            undefined,
            findTokenIndexInPool(chainPoolsMap[chain], bpt, exitTokenAddress),
          ],
          ["uint256", "uint256", "uint256"]
        ),
      })
    )
  } else if (exitKind === ExitKind.proportional) {
    permissions.push(
      // It doesn't matter the blockchain we use, as the Vault address remains the same
      allow.mainnet.balancer.vault.exitPool(pId, c.avatar, c.avatar, {
        userData: c.abiEncodedMatches(
          poolType === "ComposableStable" ? [2] : [1],
          ["uint256"]
        ),
      })
    )
  } else {
    // Default case when `exitKind` is not specified
    permissions.push(
      allow.mainnet.balancer.vault.exitPool(pId, c.avatar, c.avatar)
    )
  }

  if (gauge) {
    permissions.push({
      ...allow.mainnet.balancer.gauge["withdraw(uint256)"](),
      targetAddress: gauge,
    })
  }

  return permissions
}
