import { gor as allow } from "./protocols"
import { gor as schema } from "./protocols/schema"

import { createApply } from "./apply"
import { createExportJson } from "./json"

export { allow, schema }

export const apply = createApply(5)
export const exportJson = createExportJson(5)
