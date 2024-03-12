import * as aave_v2 from "./aave/v2"
import * as aave_v3 from "./aave/v3"
import * as ankr from "./ankr"
import * as aura from "./aura"
import * as balancer from "./balancer"
import * as compound_v2 from "./compound/v2"
// import * as compound_v3 from "./compound/v3"
import * as convex from "./convex"
import * as cowswap from "./cowswap"
import * as lido from "./lido"
import * as maker from "./maker"
import * as rocket_pool from "./rocket_pool"
import * as spark from "./spark"
import * as stader from "./stader"
import * as stakewise_v2 from "./stakewise/v2"
import * as uniswap_v3 from "./uniswap/v3"

import { annotateAll } from "./annotate"

// group all protocols actions by chain and wrap the functions to the resulting permissions sets are annotated

export const eth = annotateAll(
  {
    aave_v2: aave_v2.eth,
    aave_v3: aave_v3.eth,
    ankr: ankr.eth,
    aura: aura.eth,
    balancer: balancer.eth,
    compound_v2: compound_v2.eth,
    // compound_v3: compound_v3.eth,
    convex: convex.eth,
    cowswap: cowswap.eth,
    lido: lido.eth,
    maker: maker.eth,
    rocket_pool: rocket_pool.eth,
    spark: spark.eth,
    stader: stader.eth,
    stakewise_v2: stakewise_v2.eth,
    uniswap_v3: uniswap_v3.eth,
  },
  "eth"
)

export const gno = annotateAll(
  {
    aura: aura.gno,
    cowswap: cowswap.gno,
  },
  "gno"
)
