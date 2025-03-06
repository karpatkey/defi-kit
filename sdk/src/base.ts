import { base as allowProtocols } from "./protocols"
import { base as schemaProtocols } from "./protocols/schema"
import { base as allowBridges } from "./bridges"
import { base as schemaBridges } from "./bridges/schema"

import { base as repertoireAllow } from "./repertoire"
import { base as repertoireSchema } from "./repertoire/schema"

import { createApply } from "./apply"
import { createExportToSafeTransactionBuilder } from "./export"

export const allow = { ...allowProtocols, ...allowBridges }
export const schema = { ...schemaProtocols, ...schemaBridges }

export const repertoire = { allow: repertoireAllow, schema: repertoireSchema }

export const apply = createApply(8453)
export const exportToSafeTransactionBuilder =
  createExportToSafeTransactionBuilder(8453)
