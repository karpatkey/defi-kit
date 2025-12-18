import * as aaveV3 from "./aave/v3/schema"
import * as ankr from "./ankr/schema"
import * as aura from "./aura/schema"
import * as balancerV2 from "./balancer/v2/schema"
import * as compoundV3 from "./compound/v3/schema"
import * as convex from "./convex/schema"
import * as cowSwap from "./cowSwap/schema"
import * as fluid from "./fluid/schema"
import * as lido from "./lido/schema"
import * as morphoMarkets from "./morpho/markets/schema"
import * as morphoVaults from "./morpho/vaults/schema"
import * as sky from "./sky/schema"
import * as rocketPool from "./rocketPool/schema"
import * as spark from "./spark/schema"
import * as stader from "./stader/schema"
import * as stakeWiseV3 from "./stakeWise/v3/schema"
import * as uniswapV3 from "./uniswap/v3/schema"
import { ProtocolSchemas } from "../types"

// group all protocols schemas by chain
// IMPORTANT: API keys were rolled back to prevent breaking annotations in existing policies.
export const eth = {
  aave_v3: aaveV3.eth,
  ankr: ankr.eth,
  aura: aura.eth,
  compound_v3: compoundV3.eth,
  convex: convex.eth,
  cowswap: cowSwap.eth,
  fluid: fluid.eth,
  lido: lido.eth,
  morphoMarkets: morphoMarkets.eth,
  morphoVaults: morphoVaults.eth,
  sky: sky.eth,
  rocket_pool: rocketPool.eth,
  spark: spark.eth,
  stader: stader.eth,
  stakewise_v3: stakeWiseV3.eth,
  uniswap_v3: uniswapV3.eth,
} satisfies ProtocolSchemas

export const gno = {
  aave_v3: aaveV3.gno,
  aura: aura.gno,
  balancer_v2: balancerV2.gno,
  cowswap: cowSwap.gno,
  spark: spark.gno,
  stakewise_v3: stakeWiseV3.gno,
  uniswap_v3: uniswapV3.gno,
} satisfies ProtocolSchemas

export const arb1 = {
  aave_v3: aaveV3.arb1,
  aura: aura.arb1,
  balancer_v2: balancerV2.arb1,
  cowswap: cowSwap.arb1,
  fluid: fluid.arb1,
  morphoMarkets: morphoMarkets.arb1,
  morphoVaults: morphoVaults.arb1,
  uniswap_v3: uniswapV3.arb1,
} satisfies ProtocolSchemas

export const oeth = {
  aave_v3: aaveV3.oeth,
  aura: aura.oeth,
  balancer_v2: balancerV2.oeth,
  uniswap_v3: uniswapV3.oeth,
} satisfies ProtocolSchemas

export const base = {
  aave_v3: aaveV3.base,
  aura: aura.base,
  balancer_v2: balancerV2.base,
  cowswap: cowSwap.base,
  fluid: fluid.base,
  morphoMarkets: morphoMarkets.base,
  morphoVaults: morphoVaults.base,
  uniswap_v3: uniswapV3.base,
} satisfies ProtocolSchemas
