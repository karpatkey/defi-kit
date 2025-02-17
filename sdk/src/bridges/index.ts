import * as circle from "./circle"
import { annotateAll } from "../protocols/annotate"

// group all protocols actions by chain and wrap the functions to the resulting permissions sets are annotated
// IMPORTANT: API keys were rolled back to prevent breaking annotations in existing policies.
export const eth = annotateAll(
  {
    circle: circle.eth,
  },
  "eth"
)
