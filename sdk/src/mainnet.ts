import { mainnet } from "./protocols"
import { createApply } from "./apply"

export const allow = mainnet
export const apply = createApply(1)
