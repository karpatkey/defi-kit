import * as aave_v2 from "./aave/v2/schema"
import * as aave_v3 from "./aave/v3/schema"
import * as aura from "./aura/schema"
import * as balancer from "./balancer/schema"
import * as compound_v2 from "./compound/v2/schema"
// import * as compound_v3 from "./compound/v3/schema"
import * as convex from "./convex/schema"
import * as cowswap from "./cowswap/schema"
import * as lido from "./lido/schema"
import * as maker from "./maker/schema"
import * as spark from "./spark/schema"
import { ProtocolSchemas } from "../types"

// group all protocols schemas by chain

export const eth = {
  aave_v2: aave_v2.eth,
  aave_v3: aave_v3.eth,
  aura: aura.eth,
  balancer: balancer.eth,
  compound_v2: compound_v2.eth,
  // compound_v3: compound_v3.eth,
  convex: convex.eth,
  cowswap: cowswap.eth,
  lido: lido.eth,
  maker: maker.eth,
  spark: spark.eth,
} satisfies Record<string, ProtocolSchemas>

export const gno = {
  aura: aura.gno,
  cowswap: cowswap.gno,
} satisfies Record<string, ProtocolSchemas>
