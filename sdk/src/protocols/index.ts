import * as aave_v2 from "./aave/v2"
import * as aave_v3 from "./aave/v3"
import * as aura from "./aura"
import * as balancer from "./balancer"
import * as compound_v2 from "./compound/v2"
import * as compound_v3 from "./compound/v3"
import * as convex from "./convex"
import * as cowswap from "./cowswap"
import * as curve from "./curve"
import * as lido from "./lido"
import * as spark from "./spark"

import { annotateAll } from "./annotate"

// group all protocols actions by chain and wrap the functions to the resulting permissions sets are annotated

export const eth = annotateAll(
  {
    aave_v2: aave_v2.eth,
    aave_v3: aave_v3.eth,
    aura: aura.eth,
    balancer: balancer.eth,
    compound_v2: compound_v2.eth,
    compound_v3: compound_v3.eth,
    convex: convex.eth,
    curve: curve.eth,
    lido: lido.eth,
    spark: spark.eth,
  },
  "eth"
)

export const gor = annotateAll(
  {
    cowswap: cowswap.gor,
  },
  "gor"
)
