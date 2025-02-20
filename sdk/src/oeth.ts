import { oeth as allowProtocols } from "./protocols"
import { oeth as schemaProtocols } from "./protocols/schema"
import { oeth as allowBridges } from "./bridges"
import { oeth as schemaBridges } from "./bridges/schema"

import { oeth as repertoireAllow } from "./repertoire"
import { oeth as repertoireSchema } from "./repertoire/schema"

import { createApply } from "./apply"
import { createExportToSafeTransactionBuilder } from "./export"

export const allow = { ...allowProtocols, ...allowBridges }
export const schema = { ...schemaProtocols, ...schemaBridges }

export const repertoire = { allow: repertoireAllow, schema: repertoireSchema }

export const apply = createApply(10)
export const exportToSafeTransactionBuilder =
  createExportToSafeTransactionBuilder(10)
