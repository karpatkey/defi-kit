import { RepertoireSchemas } from "../types"
import * as aaveV3 from "./aave/v3/schema"
import * as aura from "./aura/schema"
import * as balancer from "./balancer/schema"
import * as lido from "./lido/schema"

// group all repertoire schemas by chain

export const eth = {
  aave_v3: aaveV3.eth,
  aura: aura.eth,
  balancer: balancer.eth,
  lido: lido.eth,
} satisfies RepertoireSchemas

export const gno = {
  aave_v3: aaveV3.gno,
  aura: aura.gno,
  balancer: balancer.gno,
} satisfies RepertoireSchemas

export const arb1 = {
  aave_v3: aaveV3.arb1,
  aura: aura.arb1,
  balancer: balancer.arb1,
} satisfies RepertoireSchemas

export const oeth = {
  aave_v3: aaveV3.oeth,
  aura: aura.oeth,
  balancer: balancer.oeth,
} satisfies RepertoireSchemas

export const base = {
  aave_v3: aaveV3.base,
  aura: aura.base,
  balancer: balancer.base,
} satisfies RepertoireSchemas
