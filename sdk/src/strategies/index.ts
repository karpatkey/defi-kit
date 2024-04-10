import * as disassemble from "./disassemble"
import { annotateAll } from "./annotate"

// group all strategies by chain

export const eth = annotateAll(
  {
    disassemble: disassemble.eth,
  },
  "eth"
)

export const gno = annotateAll(
  {
    disassemble: disassemble.eth,
  },
  "gno"
)
