import * as circle from "./circle/schema"
import { BridgeSchemas } from "../types"

// group all protocols schemas by chain
// IMPORTANT: API keys were rolled back to prevent breaking annotations in existing policies.
export const eth = {
  circle: circle.eth,
} satisfies BridgeSchemas
