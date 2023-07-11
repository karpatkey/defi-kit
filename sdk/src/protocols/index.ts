import { ProtocolActions } from "../types"
import * as aura from "./aura"
import * as curve from "./curve"
import * as cowswap from "./cowswap"
import * as lido from "./lido"

// group all protocols actions by chain

export const eth = {
  aura: aura.eth,
  curve: curve.eth,
  lido: lido.eth,
} satisfies Record<string, ProtocolActions>

export const gor = {
  cowswap: cowswap.gor,
} satisfies Record<string, ProtocolActions>
