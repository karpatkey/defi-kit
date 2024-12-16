import {
  EthRewarder,
  GnoRewarder,
  Arb1Rewarder,
  OethRewarder,
  BaseRewarder,
} from "../../protocols/aura/types"
import { Chain } from "../../types"
import { withdraw, withdraw_balancer, ExitKind } from "./strategies"

export const eth = {
  withdraw: async ({ rewarder }: { rewarder: EthRewarder }) =>
    withdraw(rewarder),

  withdraw_proportional: async ({ rewarder }: { rewarder: EthRewarder }) =>
    withdraw_balancer(Chain.eth, rewarder, ExitKind.proportional),

  withdraw_single_token: async ({ rewarder, exitTokenIndex }: { rewarder: EthRewarder, exitTokenIndex: number }) =>
    withdraw_balancer(Chain.eth, rewarder, ExitKind.single, exitTokenIndex),
}

export const gno = {
  withdraw: async ({ rewarder }: { rewarder: GnoRewarder }) =>
    withdraw(rewarder),

  withdraw_proportional: async ({ rewarder }: { rewarder: GnoRewarder }) =>
    withdraw_balancer(Chain.gno, rewarder, ExitKind.proportional),

  withdraw_single_token: async ({ rewarder, exitTokenIndex }: { rewarder: GnoRewarder, exitTokenIndex: number }) =>
    withdraw_balancer(Chain.gno, rewarder, ExitKind.single, exitTokenIndex),
}

export const arb1 = {
  withdraw: async ({ rewarder }: { rewarder: Arb1Rewarder }) =>
    withdraw(rewarder),

  withdraw_proportional: async ({ rewarder }: { rewarder: Arb1Rewarder }) =>
    withdraw_balancer(Chain.arb1, rewarder, ExitKind.proportional),

  withdraw_single_token: async ({ rewarder, exitTokenIndex  }: { rewarder: Arb1Rewarder, exitTokenIndex: number }) =>
    withdraw_balancer(Chain.arb1, rewarder, ExitKind.single, exitTokenIndex),
}

export const oeth = {
  withdraw: async ({ rewarder }: { rewarder: OethRewarder }) =>
    withdraw(rewarder),

  withdraw_proportional: async ({ rewarder }: { rewarder: OethRewarder }) =>
    withdraw_balancer(Chain.oeth, rewarder, ExitKind.proportional),

  withdraw_single_token: async ({ rewarder, exitTokenIndex }: { rewarder: OethRewarder, exitTokenIndex: number }) =>
    withdraw_balancer(Chain.oeth, rewarder, ExitKind.single, exitTokenIndex),
}

export const base = {
  withdraw: async ({ rewarder }: { rewarder: BaseRewarder }) =>
    withdraw(rewarder),

  withdraw_proportional: async ({ rewarder }: { rewarder: BaseRewarder }) =>
    withdraw_balancer(Chain.base, rewarder, ExitKind.proportional),

  withdraw_single_token: async ({ rewarder, exitTokenIndex }: { rewarder: BaseRewarder, exitTokenIndex: number }) =>
    withdraw_balancer(Chain.base, rewarder, ExitKind.single, exitTokenIndex),
}
