import { Chain } from "../../types"
import { withdrawOptions } from "./actions"
import { ExitKind } from "../balancer/actions"

export const eth = {
  withdraw: async ({ rewarder }: { rewarder: `0x${string}` }) =>
    withdrawOptions(rewarder),

  withdraw_proportional: async ({ rewarder }: { rewarder: `0x${string}` }) =>
    withdrawOptions(rewarder, true, Chain.eth, ExitKind.proportional),

  withdraw_single_token: async ({
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
  withdraw: async ({ rewarder }: { rewarder: `0x${string}` }) =>
    withdrawOptions(rewarder),

  withdraw_proportional: async ({ rewarder }: { rewarder: `0x${string}` }) =>
    withdrawOptions(rewarder, true, Chain.gno, ExitKind.proportional),

  withdraw_single_token: async ({
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
  withdraw: async ({ rewarder }: { rewarder: `0x${string}` }) =>
    withdrawOptions(rewarder),

  withdraw_proportional: async ({ rewarder }: { rewarder: `0x${string}` }) =>
    withdrawOptions(rewarder, true, Chain.arb1, ExitKind.proportional),

  withdraw_single_token: async ({
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
  withdraw: async ({ rewarder }: { rewarder: `0x${string}` }) =>
    withdrawOptions(rewarder),

  withdraw_proportional: async ({ rewarder }: { rewarder: `0x${string}` }) =>
    withdrawOptions(rewarder, true, Chain.oeth, ExitKind.proportional),

  withdraw_single_token: async ({
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
  withdraw: async ({ rewarder }: { rewarder: `0x${string}` }) =>
    withdrawOptions(rewarder),

  withdraw_proportional: async ({ rewarder }: { rewarder: `0x${string}` }) =>
    withdrawOptions(rewarder, true, Chain.base, ExitKind.proportional),

  withdraw_single_token: async ({
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
