import { gno as allowProtocols } from "./protocols"
import { gno as schemaProtocols } from "./protocols/schema"
import { gno as allowBridges } from "./bridges"
import { gno as schemaBridges } from "./bridges/schema"

import { gno as repertoireAllow } from "./repertoire"
import { gno as repertoireSchema } from "./repertoire/schema"

import { createApply } from "./apply"
import { createExportToSafeTransactionBuilder } from "./export"

export const allow = { ...allowProtocols, ...allowBridges }
export const schema = { ...schemaProtocols, ...schemaBridges }

export const repertoire = { allow: repertoireAllow, schema: repertoireSchema }

export const apply = createApply(100)
export const exportToSafeTransactionBuilder =
  createExportToSafeTransactionBuilder(100)
