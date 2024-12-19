import { StrategySchemas } from "../types"
import * as aura from "./aura/schema"
import * as balancer from "./balancer/schema"

// group all strategy schemas by chain

export const eth = {
  aura: aura.eth,
  balancer: balancer.eth,
} satisfies StrategySchemas

export const gno = {
  aura: aura.gno,
  balancer: balancer.gno,
} satisfies StrategySchemas

export const arb1 = {
  aura: aura.arb1,
  balancer: balancer.arb1,
} satisfies StrategySchemas

export const oeth = {
  aura: aura.oeth,
  balancer: balancer.oeth,
} satisfies StrategySchemas

export const base = {
  aura: aura.base,
  balancer: balancer.base,
} satisfies StrategySchemas
