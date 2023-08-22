import zod from "zod"
import { Chain } from "defi-kit"
import {
  OpenAPIRegistry,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi"

import { sdks } from "./sdk"
import { registerBorrow } from "./actions/borrow"
import { registerDeposit } from "./actions/deposit"
import { registerSwap } from "./actions/swap"
import { registerStake } from "./actions/stake"
import { registerLock } from "./actions/lock"
import { registerDelegate } from "./actions/delegate"

extendZodWithOpenApi(zod)

export const registry = new OpenAPIRegistry()

// traverse through the sdk structure and register all API endpoints
Object.entries(sdks).forEach(([chain, sdk]) => {
  const chainPrefix = chain as Chain

  Object.entries(sdk.allow).forEach(([protocol, protocolActions]) => {
    Object.keys(protocolActions).forEach((action) => {
      switch (action) {
        case "borrow":
          registerBorrow(registry, chainPrefix, protocol)
          return
        case "deposit":
          registerDeposit(registry, chainPrefix, protocol)
          return
        case "swap":
          registerSwap(registry, chainPrefix, protocol)
          return
        case "stake":
          registerStake(registry, chainPrefix, protocol)
          return
        case "lock":
          registerLock(registry, chainPrefix, protocol)
          return
        default:
          throw new Error(`Unknown action: ${action}`)
      }
    })
  })
})
