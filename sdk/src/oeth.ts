import { oeth as allow } from "./protocols"
import { oeth as schema } from "./protocols/schema"

import { oeth as allowStrategy } from "./strategies"
import { oeth as strategiesSchema } from "./strategies/schema"

import { createApply } from "./apply"
import { createExportToSafeTransactionBuilder } from "./export"

export { allow, schema, allowStrategy, strategiesSchema }

export const apply = createApply(10)
export const exportToSafeTransactionBuilder =
  createExportToSafeTransactionBuilder(10)
