import { gor } from "./protocols"
import { createApply } from "./apply"
import { createExportJson } from "./json"

export const allow = gor
export const apply = createApply(5)
export const exportJson = createExportJson(5)
