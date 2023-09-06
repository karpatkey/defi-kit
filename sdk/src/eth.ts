import { eth as allow } from "./protocols"
import { eth as schema } from "./protocols/schema"

import { createApply } from "./apply"
import { createExportToSafeTransactionBuilder } from "./export"

export { allow, schema }

export const apply = createApply(1)
export const exportToSafeTransactionBuilder =
  createExportToSafeTransactionBuilder(1)
