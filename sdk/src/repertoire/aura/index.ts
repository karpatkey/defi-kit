import { Chain } from "../../types"
import { withdrawOptions } from "./actions"
import { ExitKind } from "../balancer/v2/actions"

export const eth = {
  unstake: async ({ rewarder }: { rewarder: `0x${string}` }) =>
    withdrawOptions(rewarder),

  unstake_withdraw_proportional: async ({
    rewarder,
  }: {
    rewarder: `0x${string}`
  }) => withdrawOptions(rewarder, true, Chain.eth, ExitKind.proportional),

  unstake_withdraw_single_token: async ({
    rewarder,
    exitTokenAddress,
  }: {
    rewarder: `0x${string}`
    exitTokenAddress: `0x${string}`
  }) =>
    withdrawOptions(
      rewarder,
      true,
      Chain.eth,
      ExitKind.single,
      exitTokenAddress
    ),
}

export const gno = {
  unstake: async ({ rewarder }: { rewarder: `0x${string}` }) =>
    withdrawOptions(rewarder),

  unstake_withdraw_proportional: async ({
    rewarder,
  }: {
    rewarder: `0x${string}`
  }) => withdrawOptions(rewarder, true, Chain.gno, ExitKind.proportional),

  unstake_withdraw_single_token: async ({
    rewarder,
    exitTokenAddress,
  }: {
    rewarder: `0x${string}`
    exitTokenAddress: `0x${string}`
  }) =>
    withdrawOptions(
      rewarder,
      true,
      Chain.gno,
      ExitKind.single,
      exitTokenAddress
    ),
}

export const arb1 = {
  unstake: async ({ rewarder }: { rewarder: `0x${string}` }) =>
    withdrawOptions(rewarder),

  unstake_withdraw_proportional: async ({
    rewarder,
  }: {
    rewarder: `0x${string}`
  }) => withdrawOptions(rewarder, true, Chain.arb1, ExitKind.proportional),

  unstake_withdraw_single_token: async ({
    rewarder,
    exitTokenAddress,
  }: {
    rewarder: `0x${string}`
    exitTokenAddress: `0x${string}`
  }) =>
    withdrawOptions(
      rewarder,
      true,
      Chain.arb1,
      ExitKind.single,
      exitTokenAddress
    ),
}

export const oeth = {
  unstake: async ({ rewarder }: { rewarder: `0x${string}` }) =>
    withdrawOptions(rewarder),

  unstake_withdraw_proportional: async ({
    rewarder,
  }: {
    rewarder: `0x${string}`
  }) => withdrawOptions(rewarder, true, Chain.oeth, ExitKind.proportional),

  unstake_withdraw_single_token: async ({
    rewarder,
    exitTokenAddress,
  }: {
    rewarder: `0x${string}`
    exitTokenAddress: `0x${string}`
  }) =>
    withdrawOptions(
      rewarder,
      true,
      Chain.oeth,
      ExitKind.single,
      exitTokenAddress
    ),
}

export const base = {
  unstake: async ({ rewarder }: { rewarder: `0x${string}` }) =>
    withdrawOptions(rewarder),

  unstake_withdraw_proportional: async ({
    rewarder,
  }: {
    rewarder: `0x${string}`
  }) => withdrawOptions(rewarder, true, Chain.base, ExitKind.proportional),

  unstake_withdraw_single_token: async ({
    rewarder,
    exitTokenAddress,
  }: {
    rewarder: `0x${string}`
    exitTokenAddress: `0x${string}`
  }) =>
    withdrawOptions(
      rewarder,
      true,
      Chain.base,
      ExitKind.single,
      exitTokenAddress
    ),
}
