import zod from "zod"
import { Chain } from "defi-presets"
import {
  OpenAPIRegistry,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi"

import { sdks } from "./sdk"
import { registerDeposit } from "./actions/deposit"
import { registerSwap } from "./actions/swap"

extendZodWithOpenApi(zod)

export const registry = new OpenAPIRegistry()

// traverse through the sdk structure and register all API endpoints
Object.entries(sdks).forEach(([chain, sdk]) => {
  const chainPrefix = chain as Chain

  Object.entries(sdk.allow).forEach(([protocol, protocolActions]) => {
    Object.keys(protocolActions).forEach((action) => {
      switch (action) {
        case "deposit":
          registerDeposit(registry, chainPrefix, protocol)
          return
        case "swap":
          registerSwap(registry, chainPrefix, protocol)
          return
        default:
          throw new Error(`Unknown action: ${action}`)
      }
    })
  })
})
