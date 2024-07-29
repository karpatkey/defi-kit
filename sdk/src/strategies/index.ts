import * as exit from "./exit"
import { annotateAll } from "./annotate"

// group all strategies by chain

export const eth = annotateAll(
  {
    exit: exit.eth,
  },
  "eth"
)

export const gno = annotateAll(
  {
    exit: exit.eth,
  },
  "gno"
)
