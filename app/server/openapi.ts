import zod from "zod"
import { Chain } from "defi-kit"
import {
  OpenAPIRegistry,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi"

import { sdks } from "./sdk"
import {
  registerAllowBorrow,
  registerBorrowPermissions,
} from "./actions/borrow"
import { registerAllowDeposit } from "./actions/deposit"
import { registerAllowSwap } from "./actions/swap"
import { registerAllowStake } from "./actions/stake"
import { registerAllowLock } from "./actions/lock"
import { registerAllowDelegate } from "./actions/delegate"

extendZodWithOpenApi(zod)

export const registry = new OpenAPIRegistry()

// traverse through the sdk structure and register all API endpoints
Object.entries(sdks).forEach(([chain, sdk]) => {
  const chainPrefix = chain as Chain

  Object.entries(sdk.allow).forEach(([protocol, protocolActions]) => {
    Object.keys(protocolActions).forEach((action) => {
      switch (action) {
        case "borrow":
          registerAllowBorrow(registry, chainPrefix, protocol)
          registerBorrowPermissions(registry, chainPrefix, protocol)
          return
        case "deposit":
          registerAllowDeposit(registry, chainPrefix, protocol)
          registerDepositPermissions(registry, chainPrefix, protocol)
          return
        case "swap":
          registerAllowSwap(registry, chainPrefix, protocol)
          registerSwapPermissions(registry, chainPrefix, protocol)
          return
        case "stake":
          registerAllowStake(registry, chainPrefix, protocol)
          registerStakePermissions(registry, chainPrefix, protocol)
          return
        case "lock":
          registerAllowLock(registry, chainPrefix, protocol)
          registerLockPermissions(registry, chainPrefix, protocol)
          return
        case "delegate":
          registerAllowDelegate(registry, chainPrefix, protocol)
          registerDelegatePermissions(registry, chainPrefix, protocol)
          return
        default:
          throw new Error(`Unknown action: ${action}`)
      }
    })
  })
})
