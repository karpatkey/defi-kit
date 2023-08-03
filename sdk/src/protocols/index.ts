import { ProtocolActions } from "../types"
import * as aave_v2 from "./aave/v2"
import * as aave_v3 from "./aave/v3"
import * as aura from "./aura"
import * as balancer from "./balancer"
import * as compound_v2 from "./compound/v2"
import * as compound_v3 from "./compound/v3"
import * as curve from "./curve"
import * as cowswap from "./cowswap"
import * as lido from "./lido"
import * as makerdao from "./makerdao"

// group all protocols actions by chain

export const eth = {
  aave_v2: aave_v2.eth,
  aave_v3: aave_v3.eth,
  aura: aura.eth,
  balancer: balancer.eth,
  compound_v2: compound_v2.eth,
  compound_v3: compound_v3.eth,
  curve: curve.eth,
  lido: lido.eth,
  makerdao: makerdao.eth
} satisfies Record<string, ProtocolActions>

export const gor = {
  cowswap: cowswap.gor,
} satisfies Record<string, ProtocolActions>
