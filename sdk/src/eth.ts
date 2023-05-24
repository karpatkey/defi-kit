import { eth } from "./protocols"
import { createApply } from "./apply"
import { createExportJson } from "./json"

export const allow = eth
export const apply = createApply(1)
export const exportJson = createExportJson(1)
