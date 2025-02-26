import { arb1 as allowProtocols } from "./protocols"
import { arb1 as schemaProtocols } from "./protocols/schema"
import { arb1 as allowBridges } from "./bridges"
import { arb1 as schemaBridges } from "./bridges/schema"

import { arb1 as repertoireAllow } from "./repertoire"
import { arb1 as repertoireSchema } from "./repertoire/schema"

import { createApply } from "./apply"
import { createExportToSafeTransactionBuilder } from "./export"

export const allow = { ...allowProtocols, ...allowBridges }
export const schema = { ...schemaProtocols, ...schemaBridges }

export const repertoire = { allow: repertoireAllow, schema: repertoireSchema }

export const apply = createApply(42161)
export const exportToSafeTransactionBuilder =
  createExportToSafeTransactionBuilder(42161)
