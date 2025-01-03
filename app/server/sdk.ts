import * as eth from "defi-kit/eth"
import * as gno from "defi-kit/gno"
import * as arb1 from "defi-kit/arb1"
import * as oeth from "defi-kit/oeth"
import * as base from "defi-kit/base"
import { ActionName, Chain, NotFoundError, AllowFunction } from "defi-kit"
import { parseQuery } from "./parse"

export const sdks = {
  eth,
  gno,
  arb1,
  oeth,
  base,
} as const

export type ChainPrefix = keyof typeof sdks

export const queryActionPermissionSet = ({
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
    | AllowFunction
    | undefined
  const paramsSchema = (schema as any)[protocol][action]

  if (!allowAction || !paramsSchema) {
    throw new NotFoundError(
      `${protocol} does not implement the ${action} action`
    )
  }

  return allowAction(parseQuery(query, paramsSchema))
}

export const queryRepertoirePermissionSet = ({
  chain,
  protocol,
  name,
  query,
}: {
  chain: Chain
  protocol: string
  name: string
  query: Partial<{
    [key: string]: string | string[]
  }>
}) => {
  const sdk = sdks[chain]
  const {
    repertoire: { allow, schema },
  } = sdk

  if (!(protocol in schema) || !(protocol in allow)) {
    throw new NotFoundError(
      `${protocol} repertoire actions are not supported on ${chain}`
    )
  }

  const allowFn = (allow as any)[protocol]?.[name] as AllowFunction | undefined
  const paramsSchema = (schema as any)[protocol]?.[name]

  if (!allowFn || !paramsSchema) {
    throw new NotFoundError(
      `${protocol} '$${name}' repertoire action does not exist`
    )
  }

  return allowFn(parseQuery(query, paramsSchema))
}
