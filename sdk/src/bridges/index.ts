import * as circleV1 from "./circle/v1"
import { annotateAll } from "../protocols/annotate"

// group all protocols actions by chain and wrap the functions to the resulting permissions sets are annotated
// IMPORTANT: API keys were rolled back to prevent breaking annotations in existing policies.
export const eth = annotateAll(
  {
    circle_v1: circleV1.eth,
  },
  "eth"
)

export const gno = annotateAll({}, "gno")

export const arb1 = annotateAll(
  {
    circle_v1: circleV1.arb1,
  },
  "arb1"
)

export const oeth = annotateAll(
  {
    circle_v1: circleV1.oeth,
  },
  "oeth"
)

export const base = annotateAll(
  {
    circle_v1: circleV1.base,
  },
  "base"
)
