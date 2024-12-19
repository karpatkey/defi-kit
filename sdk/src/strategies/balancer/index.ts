import { Chain } from "../../types"
import { withdrawOptions } from "./strategies"
import { ExitKind } from "./strategies"

export const eth = {
  withdraw_proportional: async ({ bpt }: { bpt: `0x${string}` }) =>
    withdrawOptions(Chain.eth, bpt, ExitKind.proportional),

  withdraw_single: async ({
    bpt,
    exitTokenAddress,
  }: {
    bpt: `0x${string}`
    exitTokenAddress: `0x${string}`
  }) =>
    withdrawOptions(
      Chain.eth,
      bpt,
      ExitKind.single,
      exitTokenAddress
    ),
  
  unstake_withdraw_proportional: async ({ gauge }: { gauge: `0x${string}` }) =>
    withdrawOptions(Chain.eth, undefined, ExitKind.proportional, undefined, gauge),

  unstake_withdraw_single: async ({ gauge }: { gauge: `0x${string}` }) =>
    withdrawOptions(Chain.eth, undefined, ExitKind.single, undefined, gauge),
}

export const gno = {
  withdraw_proportional: async ({ bpt }: { bpt: `0x${string}` }) =>
    withdrawOptions(Chain.gno, bpt, ExitKind.proportional),

  withdraw_single: async ({
    bpt,
    exitTokenAddress,
  }: {
    bpt: `0x${string}`
    exitTokenAddress: `0x${string}`
  }) =>
    withdrawOptions(
      Chain.gno,
      bpt,
      ExitKind.single,
      exitTokenAddress
    ),
  
  unstake_withdraw_proportional: async ({ gauge }: { gauge: `0x${string}` }) =>
    withdrawOptions(Chain.gno, undefined, ExitKind.proportional, undefined, gauge),

  unstake_withdraw_single: async ({ gauge }: { gauge: `0x${string}` }) =>
    withdrawOptions(Chain.gno, undefined, ExitKind.single, undefined, gauge),
}

export const arb1 = {
  withdraw_proportional: async ({ bpt }: { bpt: `0x${string}` }) =>
    withdrawOptions(Chain.arb1, bpt, ExitKind.proportional),

  withdraw_single: async ({
    bpt,
    exitTokenAddress,
  }: {
    bpt: `0x${string}`
    exitTokenAddress: `0x${string}`
  }) =>
    withdrawOptions(
      Chain.arb1,
      bpt,
      ExitKind.single,
      exitTokenAddress
    ),

  unstake_withdraw_proportional: async ({ gauge }: { gauge: `0x${string}` }) =>
    withdrawOptions(Chain.arb1, undefined, ExitKind.proportional, undefined, gauge),

  unstake_withdraw_single: async ({ gauge }: { gauge: `0x${string}` }) =>
    withdrawOptions(Chain.arb1, undefined, ExitKind.single, undefined, gauge),
}

export const oeth = {
  withdraw_proportional: async ({ bpt }: { bpt: `0x${string}` }) =>
    withdrawOptions(Chain.oeth, bpt, ExitKind.proportional),

  withdraw_single: async ({
    bpt,
    exitTokenAddress,
  }: {
    bpt: `0x${string}`
    exitTokenAddress: `0x${string}`
  }) =>
    withdrawOptions(
      Chain.oeth,
      bpt,
      ExitKind.single,
      exitTokenAddress
    ),

  unstake_withdraw_proportional: async ({ gauge }: { gauge: `0x${string}` }) =>
    withdrawOptions(Chain.oeth, undefined, ExitKind.proportional, undefined, gauge),

  unstake_withdraw_single: async ({ gauge }: { gauge: `0x${string}` }) =>
    withdrawOptions(Chain.oeth, undefined, ExitKind.single, undefined, gauge),
}

export const base = {
  withdraw_proportional: async ({ bpt }: { bpt: `0x${string}` }) =>
    withdrawOptions(Chain.base, bpt, ExitKind.proportional),

  withdraw_single: async ({
    bpt,
    exitTokenAddress,
  }: {
    bpt: `0x${string}`
    exitTokenAddress: `0x${string}`
  }) =>
    withdrawOptions(
      Chain.base,
      bpt,
      ExitKind.single,
      exitTokenAddress
    ),
  
  unstake_withdraw_proportional: async ({ gauge }: { gauge: `0x${string}` }) =>
    withdrawOptions(Chain.base, undefined, ExitKind.proportional, undefined, gauge),

  unstake_withdraw_single: async ({ gauge }: { gauge: `0x${string}` }) =>
    withdrawOptions(Chain.base, undefined, ExitKind.single, undefined, gauge),
}