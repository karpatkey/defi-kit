import { ProtocolActions } from "../types"
import * as curve from "./curve"

// group all protocols actions by network
export const eth = {
  curve: curve.eth,
} satisfies Record<string, ProtocolActions>
