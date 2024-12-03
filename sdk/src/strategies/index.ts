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
    aura: aura.eth,
  },
  "gno"
)

export const arb1 = annotateAll(
  {
    
  },
  "arb1"
)
export const oeth = annotateAll(
  {
   
  },
  "oeth"
)

export const base = annotateAll(
  {
    
  },
  "base"
)
