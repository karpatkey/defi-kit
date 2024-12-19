import * as aura from "./aura"
import * as balancer from "./balancer"
import { annotateAll } from "./annotate"

// group all strategies by chain

export const eth = annotateAll(
  {
    aura: aura.eth,
    balancer: balancer.eth,
  },
  "eth"
)

export const gno = annotateAll(
  {
    aura: aura.gno,
    balancer: balancer.gno,
  },
  "gno"
)

export const arb1 = annotateAll(
  {
    aura: aura.arb1,
    balancer: balancer.arb1,
  },
  "arb1"
)

export const oeth = annotateAll(
  {
    aura: aura.oeth,
    balancer: balancer.oeth,
  },
  "oeth"
)

export const base = annotateAll(
  {
    aura: aura.base,
    balancer: balancer.base,
  },
  "base"
)
