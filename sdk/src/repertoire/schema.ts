import { RepertoireSchemas } from "../types"
import * as aaveV3 from "./aave/v3/schema"
import * as aura from "./aura/schema"
import * as balancerV2 from "./balancer/v2/schema"
import * as lido from "./lido/schema"

// group all repertoire schemas by chain

export const eth = {
  aave_v3: aaveV3.eth,
  aura: aura.eth,
  balancer_v2: balancerV2.eth,
  lido: lido.eth,
} satisfies RepertoireSchemas

export const gno = {
  aave_v3: aaveV3.gno,
  aura: aura.gno,
  balancer_v2: balancerV2.gno,
} satisfies RepertoireSchemas

export const arb1 = {
  aave_v3: aaveV3.arb1,
  aura: aura.arb1,
  balancer_v2: balancerV2.arb1,
} satisfies RepertoireSchemas

export const oeth = {
  aave_v3: aaveV3.oeth,
  aura: aura.oeth,
  balancer_v2: balancerV2.oeth,
} satisfies RepertoireSchemas

export const base = {
  aave_v3: aaveV3.base,
  aura: aura.base,
  balancer_v2: balancerV2.base,
} satisfies RepertoireSchemas
