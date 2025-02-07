import * as aaveV3 from "./aave/v3"
import * as aura from "./aura"
import * as balancer from "./balancer"
import * as lido from "./lido"
import { annotateAll } from "./annotate"

// group all repertoire actions by chain

export const eth = annotateAll(
  {
    aaveV3: aaveV3.eth,
    aura: aura.eth,
    balancer: balancer.eth,
    lido: lido.eth,
  },
  "eth"
)

export const gno = annotateAll(
  {
    aaveV3: aaveV3.gno,
    aura: aura.gno,
    balancer: balancer.gno,
  },
  "gno"
)

export const arb1 = annotateAll(
  {
    aaveV3: aaveV3.arb1,
    aura: aura.arb1,
    balancer: balancer.arb1,
  },
  "arb1"
)

export const oeth = annotateAll(
  {
    aaveV3: aaveV3.oeth,
    aura: aura.oeth,
    balancer: balancer.oeth,
  },
  "oeth"
)

export const base = annotateAll(
  {
    aaveV3: aaveV3.base,
    aura: aura.base,
    balancer: balancer.base,
  },
  "base"
)
