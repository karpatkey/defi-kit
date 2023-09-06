import { gor as allow } from "./protocols"
import { gor as schema } from "./protocols/schema"

import { createApply } from "./apply"
import { createExportToSafeTransactionBuilder } from "./export"

export { allow, schema }

export const apply = createApply(5)
export const exportToSafeTransactionBuilder =
  createExportToSafeTransactionBuilder(5)
