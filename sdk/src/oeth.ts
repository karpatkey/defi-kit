import { oeth as allow } from "./protocols"
import { oeth as schema } from "./protocols/schema"

import { createApply } from "./apply"
import { createExportToSafeTransactionBuilder } from "./export"

export { allow, schema }

export const apply = createApply(10)
export const exportToSafeTransactionBuilder =
  createExportToSafeTransactionBuilder(10)