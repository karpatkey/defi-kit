import * as circleV1 from "./circle/v1/schema"
import { BridgeSchemas } from "../types"

// group all protocols schemas by chain
// IMPORTANT: API keys were rolled back to prevent breaking annotations in existing policies.
export const eth = {
  circle_v1: circleV1.eth,
} satisfies BridgeSchemas

export const gno = {} satisfies BridgeSchemas

export const arb1 = {
  circle_v1: circleV1.arb1,
} satisfies BridgeSchemas

export const oeth = {
  circle_v1: circleV1.arb1,
} satisfies BridgeSchemas

export const base = {
  circle_v1: circleV1.arb1,
} satisfies BridgeSchemas
