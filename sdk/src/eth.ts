import { eth as allowProtocols } from "./protocols"
import { eth as schemaProtocols } from "./protocols/schema"
import { eth as allowBridges } from "./bridges"
import { eth as schemaBridges } from "./bridges/schema"

import { eth as repertoireAllow } from "./repertoire"
import { eth as repertoireSchema } from "./repertoire/schema"

import { createApply } from "./apply"
import { createExportToSafeTransactionBuilder } from "./export"

export const allow = {...allowProtocols, ...allowBridges} 
export const schema = {...schemaProtocols, ...schemaBridges}

export const repertoire = { allow: repertoireAllow, schema: repertoireSchema }

export const apply = createApply(1)
export const exportToSafeTransactionBuilder =
  createExportToSafeTransactionBuilder(1)
