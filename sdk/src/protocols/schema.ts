import * as curve from "./curve/schema"
import * as cowswap from "./cowswap/schema"
import * as lido from "./lido/schema"
import { ProtocolSchemas } from "../types"

// group all protocols schemas by chain

export const eth = {
  curve: curve.eth,
  lido: lido.eth,
} satisfies Record<string, ProtocolSchemas>

export const gor = {
  cowswap: cowswap.gor,
} satisfies Record<string, ProtocolSchemas>
