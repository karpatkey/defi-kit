import * as aaveV2 from "./aave/v2"
import * as aaveV3 from "./aave/v3"
import * as ankr from "./ankr"
import * as aura from "./aura"
import * as balancer from "./balancer"
import * as compoundV2 from "./compound/v2"
// import * as compoundV3 from "./compound/v3"
import * as convex from "./convex"
import * as cowSwap from "./cowSwap"
import * as lido from "./lido"
import * as maker from "./maker"
import * as rocketPool from "./rocketPool"
import * as spark from "./spark"
import * as stader from "./stader"
import * as stakeWiseV2 from "./stakeWise/v2"
import * as uniswapV3 from "./uniswap/v3"

import { annotateAll } from "./annotate"

// group all protocols actions by chain and wrap the functions to the resulting permissions sets are annotated

export const eth = annotateAll(
  {
    aaveV2: aaveV2.eth,
    aaveV3: aaveV3.eth,
    ankr: ankr.eth,
    aura: aura.eth,
    balancer: balancer.eth,
    compoundV2: compoundV2.eth,
    // compoundV3: compoundV3.eth,
    convex: convex.eth,
    cowswap: cowSwap.eth,
    lido: lido.eth,
    maker: maker.eth,
    rocketPool: rocketPool.eth,
    spark: spark.eth,
    stader: stader.eth,
    stakeWiseV2: stakeWiseV2.eth,
    uniswapV3: uniswapV3.eth,
  },
  "eth"
)

export const gno = annotateAll(
  {
    aaveV3: aaveV3.gno,
    aura: aura.gno,
    balancer: balancer.gno,
    cowswap: cowSwap.gno,
    spark: spark.gno,
  },
  "gno"
)

export const arb1 = annotateAll(
  {
    aaveV3: aaveV3.arb1,
    cowswap: cowSwap.arb1,
  },
  "arb1"
)
