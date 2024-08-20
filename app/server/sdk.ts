import * as eth from "defi-kit/eth"
import * as gno from "defi-kit/gno"
import * as arb1 from "defi-kit/arb1"
import { ActionName, Chain, NotFoundError, ProtocolActions } from "defi-kit"
import { parseQuery } from "./parse"

export const sdks = {
  eth,
  gno,
  arb1,
} as const

export type ChainPrefix = keyof typeof sdks

export const queryPermissionSet = ({
  action,
  chain,
  protocol,
  query,
}: {
  action: ActionName
  chain: Chain
  protocol: string
  query: Partial<{
    [key: string]: string | string[]
  }>
}) => {
  const sdk = sdks[chain]
  const { allow, schema } = sdk

  if (!(protocol in schema) || !(protocol in allow)) {
    throw new NotFoundError(`${protocol} is not supported on ${chain}`)
  }

  const allowAction = (allow as any)[protocol][action] as
    | ProtocolActions[ActionName]
    | undefined
  const paramsSchema = (schema as any)[protocol][action]

  if (!allowAction || !paramsSchema) {
    throw new NotFoundError(
      `${protocol} does not implement the ${action} action`
    )
  }

  return allowAction(parseQuery(query, paramsSchema))
}
