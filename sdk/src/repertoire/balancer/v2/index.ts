import { Chain } from "../../../types"
import { ExitKind, withdrawOptions } from "../v2/actions"

export const eth = {
  withdraw_proportional: async ({ bpt }: { bpt: `0x${string}` }) =>
    withdrawOptions(Chain.eth, bpt, ExitKind.proportional),

  withdraw_single: async ({
    bpt,
    exitTokenAddress,
  }: {
    bpt: `0x${string}`
    exitTokenAddress: `0x${string}`
  }) => withdrawOptions(Chain.eth, bpt, ExitKind.single, exitTokenAddress),

  unstake_withdraw_proportional: async ({ gauge }: { gauge: `0x${string}` }) =>
    withdrawOptions(
      Chain.eth,
      undefined,
      ExitKind.proportional,
      undefined,
      gauge
    ),

  unstake_withdraw_single: async ({
    gauge,
    exitTokenAddress,
  }: {
    gauge: `0x${string}`
    exitTokenAddress: `0x${string}`
  }) =>
    withdrawOptions(
      Chain.eth,
      undefined,
      ExitKind.single,
      exitTokenAddress,
      gauge
    ),
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
  }) => withdrawOptions(Chain.gno, bpt, ExitKind.single, exitTokenAddress),

  unstake_withdraw_proportional: async ({ gauge }: { gauge: `0x${string}` }) =>
    withdrawOptions(
      Chain.gno,
      undefined,
      ExitKind.proportional,
      undefined,
      gauge
    ),

  unstake_withdraw_single: async ({
    gauge,
    exitTokenAddress,
  }: {
    gauge: `0x${string}`
    exitTokenAddress: `0x${string}`
  }) =>
    withdrawOptions(
      Chain.gno,
      undefined,
      ExitKind.single,
      exitTokenAddress,
      gauge
    ),
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
  }) => withdrawOptions(Chain.arb1, bpt, ExitKind.single, exitTokenAddress),

  unstake_withdraw_proportional: async ({ gauge }: { gauge: `0x${string}` }) =>
    withdrawOptions(
      Chain.arb1,
      undefined,
      ExitKind.proportional,
      undefined,
      gauge
    ),

  unstake_withdraw_single: async ({
    gauge,
    exitTokenAddress,
  }: {
    gauge: `0x${string}`
    exitTokenAddress: `0x${string}`
  }) =>
    withdrawOptions(
      Chain.arb1,
      undefined,
      ExitKind.single,
      exitTokenAddress,
      gauge
    ),
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
  }) => withdrawOptions(Chain.oeth, bpt, ExitKind.single, exitTokenAddress),

  unstake_withdraw_proportional: async ({ gauge }: { gauge: `0x${string}` }) =>
    withdrawOptions(
      Chain.oeth,
      undefined,
      ExitKind.proportional,
      undefined,
      gauge
    ),

  unstake_withdraw_single: async ({
    gauge,
    exitTokenAddress,
  }: {
    gauge: `0x${string}`
    exitTokenAddress: `0x${string}`
  }) =>
    withdrawOptions(
      Chain.oeth,
      undefined,
      ExitKind.single,
      exitTokenAddress,
      gauge
    ),
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
  }) => withdrawOptions(Chain.base, bpt, ExitKind.single, exitTokenAddress),

  unstake_withdraw_proportional: async ({ gauge }: { gauge: `0x${string}` }) =>
    withdrawOptions(
      Chain.base,
      undefined,
      ExitKind.proportional,
      undefined,
      gauge
    ),

  unstake_withdraw_single: async ({
    gauge,
    exitTokenAddress,
  }: {
    gauge: `0x${string}`
    exitTokenAddress: `0x${string}`
  }) =>
    withdrawOptions(
      Chain.base,
      undefined,
      ExitKind.single,
      exitTokenAddress,
      gauge
    ),
}
