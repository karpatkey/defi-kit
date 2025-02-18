import * as circleV1 from "./circle/v1/schema"
import { BridgeSchemas } from "../types"

// group all protocols schemas by chain
// IMPORTANT: API keys were rolled back to prevent breaking annotations in existing policies.
export const eth = {
  circle_v1: circleV1.eth,
} satisfies BridgeSchemas
