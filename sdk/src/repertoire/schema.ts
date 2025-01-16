import { RepertoireSchemas } from "../types"
import * as aura from "./aura/schema"
import * as balancer from "./balancer/schema"

// group all repertoire schemas by chain

export const eth = {
  aura: aura.eth,
  balancer: balancer.eth,
} satisfies RepertoireSchemas

export const gno = {
  aura: aura.gno,
  balancer: balancer.gno,
} satisfies RepertoireSchemas

export const arb1 = {
  aura: aura.arb1,
  balancer: balancer.arb1,
} satisfies RepertoireSchemas

export const oeth = {
  aura: aura.oeth,
  balancer: balancer.oeth,
} satisfies RepertoireSchemas

export const base = {
  aura: aura.base,
  balancer: balancer.base,
} satisfies RepertoireSchemas
