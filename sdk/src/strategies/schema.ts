import { StrategySchemas } from "../types"
import * as exit from "./exit/schema"

// group all strategy schemas by chain

export const eth = {
  exit: exit.eth,
} satisfies StrategySchemas

export const gno = {
  exit: exit.gno,
} satisfies StrategySchemas
