import { t } from "./trpc"
import { ChainPrefix, sdks } from "./sdk"
import { makeDepositProcedure } from "./deposit"
import { makeSwapProcedure } from "./swap"

const makeRouterForNetwork = (chainPrefix: ChainPrefix) => {
  const sdk = sdks[chainPrefix]

  return Object.fromEntries(
    Object.entries(sdk.allow).map(([protocol, protocolActions]) => [
      protocol,
      Object.fromEntries(
        Object.keys(protocolActions).map((action) => [
          action,
          makeProcedure(chainPrefix, protocol, action),
        ])
      ),
    ])
  )
}

const makeProcedure = (
  chainPrefix: ChainPrefix,
  protocol: string,
  action: string
) => {
  switch (action) {
    case "deposit":
      return makeDepositProcedure(chainPrefix, protocol)
    case "swap":
      return makeSwapProcedure(chainPrefix, protocol)
    default:
      throw new Error(`Unknown action: ${action}`)
  }
}

export const appRouter = t.router({
  mainnet: makeRouterForNetwork("eth"),
})

// export type AppRouter = typeof appRouter
