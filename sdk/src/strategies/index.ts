import * as aura from "./aura"
import { annotateAll } from "./annotate"

// group all strategies by chain

export const eth = annotateAll(
  {
    aura: aura.eth,
  },
  "eth"
)

export const gno = annotateAll(
  {
    aura: aura.gno,
  },
  "gno"
)

export const arb1 = annotateAll(
  {
    aura: aura.arb1,
  },
  "arb1"
)

export const oeth = annotateAll(
  {
    aura: aura.oeth,
  },
  "oeth"
)

export const base = annotateAll(
  {
    aura: aura.base,
  },
  "base"
)
