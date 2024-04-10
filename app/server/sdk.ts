import * as eth from "defi-kit/eth"
import * as gno from "defi-kit/gno"
import {
  ActionName,
  StrategyType,
  Chain,
  NotFoundError,
  AllowFunction,
} from "defi-kit"
import { parseQuery } from "./parse"

export const sdks = {
  eth,
  gno,
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

export const queryStrategyPermissionSet = ({
  type,
  chain,
  category,
  name,
  query,
}: {
  type: StrategyType
  chain: Chain
  category: string
  name: string
  query: Partial<{
    [key: string]: string | string[]
  }>
}) => {
  const sdk = sdks[chain]
  const { allowStrategy, strategiesSchema } = sdk

  if (!(type in strategiesSchema) || !(type in allowStrategy)) {
    throw new NotFoundError(`${type} strategies are not supported on ${chain}`)
  }

  const allowStrategyFn = (allowStrategy as any)[type][category]?.[name] as
    | AllowFunction
    | undefined
  const paramsSchema = (strategiesSchema as any)[type][category]?.[name]

  if (!allowStrategyFn || !paramsSchema) {
    throw new NotFoundError(
      `${type} strategy '${category} / ${name}' does not exist`
    )
  }

  return allowStrategyFn(parseQuery(query, paramsSchema))
}
