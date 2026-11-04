import { Chain } from "../src"

export const ANVIL_PORTS: Record<Chain, number> = {
  [Chain.eth]: 8545, // eth
  [Chain.arb1]: 8546, // arb1
  [Chain.gno]: 8547, // gno
  [Chain.oeth]: 8548, // oeth
  [Chain.base]: 8549, // base
} as const

/**
 * The chains this run has forks for. Mirrors TEST_CHAINS in test/anvil.mjs so
 * global setup does not wait on a fork that was never started.
 */
export const activeChains = (): Chain[] => {
  const raw = process.env.TEST_CHAINS
  const all = Object.values(Chain) as Chain[]
  if (!raw) return all

  const requested = raw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean) as Chain[]

  const unknown = requested.filter((c) => !all.includes(c))
  if (unknown.length) {
    throw new Error(`TEST_CHAINS: unknown chain(s): ${unknown.join(", ")}`)
  }
  return requested
}
