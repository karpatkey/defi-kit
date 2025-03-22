import * as aaveV3 from "./aave/v3"
import * as aura from "./aura"
import * as balancerV2 from "./balancer/v2"
import * as lido from "./lido"
import { annotateAll } from "./annotate"

// group all repertoire actions by chain

export const eth = annotateAll(
  {
    aave_v3: aaveV3.eth,
    aura: aura.eth,
    balancer_v2: balancerV2.eth,
    lido: lido.eth,
  },
  "eth"
)

export const gno = annotateAll(
  {
    aave_v3: aaveV3.gno,
    aura: aura.gno,
    balancer_v2: balancerV2.gno,
  },
  "gno"
)

export const arb1 = annotateAll(
  {
    aave_v3: aaveV3.arb1,
    aura: aura.arb1,
    balancer_v2: balancerV2.arb1,
  },
  "arb1"
)

export const oeth = annotateAll(
  {
    aave_v3: aaveV3.oeth,
    aura: aura.oeth,
    balancer_v2: balancerV2.oeth,
  },
  "oeth"
)

export const base = annotateAll(
  {
    aave_v3: aaveV3.base,
    aura: aura.base,
    balancer_v2: balancerV2.base,
  },
  "base"
)
