import { StrategySchemas } from "../types"
import * as aura from "./aura/schema"

// group all strategy schemas by chain

export const eth = {
  aura: aura.eth,
} satisfies StrategySchemas

export const gno = {
  aura: aura.gno,
} satisfies StrategySchemas

export const arb1 = {
  
} satisfies StrategySchemas

export const oeth = {
  
} satisfies StrategySchemas

export const base = {
 
} satisfies StrategySchemas