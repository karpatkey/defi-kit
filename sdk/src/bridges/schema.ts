import * as circleV1 from "./circle/v1/schema"
import * as circleV2 from "./circle/v2/schema"
import { ProtocolSchemas } from "../types"

// group all protocols schemas by chain
// IMPORTANT: API keys were rolled back to prevent breaking annotations in existing policies.
export const eth = {
  circle_v1: circleV1.eth,
  circle_v2: circleV2.eth,
} satisfies ProtocolSchemas

export const gno = {} satisfies ProtocolSchemas

export const arb1 = {
  circle_v1: circleV1.arb1,
  circle_v2: circleV2.arb1,
} satisfies ProtocolSchemas

export const oeth = {
  circle_v1: circleV1.oeth,
  circle_v2: circleV2.oeth,
} satisfies ProtocolSchemas

export const base = {
  circle_v1: circleV1.base,
  circle_v2: circleV2.base,
} satisfies ProtocolSchemas
