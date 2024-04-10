import { StrategySchemas } from "../types"
import * as disassemble from "./exit/schema"

// group all strategy schemas by chain

export const eth = {
  disassemble: disassemble.eth,
} satisfies Record<string, StrategySchemas>

export const gno = {
  disassemble: disassemble.gno,
} satisfies Record<string, StrategySchemas>
