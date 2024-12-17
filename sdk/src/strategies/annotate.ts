import { PermissionSet } from "zodiac-roles-sdk"
import { StrategyActions, AllowFunction } from "../types"

type Annotated<F extends AllowFunction> = (
  ...args: Parameters<F>
) => Promise<PermissionSet>

const annotate = <F extends AllowFunction>(
  actionFunction: F,
  path: string[]
): Annotated<F> => {
  const annotated = async (params: any) => {
    const result = await actionFunction(params)

    const queryString = new URLSearchParams(params).toString()
    const joinedPath = path.join("/")
    Object.assign(result, {
      annotation: {
        uri: `https://kit.karpatkey.com/api/v1/strategy/permissions/${joinedPath}?${queryString}`,
        schema: "https://kit.karpatkey.com/api/v1/openapi.json",
      },
    })

    return result
  }

  return annotated as (params: Parameters<F>[0]) => Promise<PermissionSet>
}

type AllAnnotated<R extends Record<string, StrategyActions>> = {
  [P in keyof R]: R[P] extends StrategyActions
    ? {
        [Key in keyof R[P]]: R[P][Key] extends AllowFunction
          ? Annotated<R[P][Key]>
          : undefined
      }
    : undefined
}

export const annotateAll = <R extends Record<string, StrategyActions>>(
  actions: R,
  chainPrefix: string
): AllAnnotated<R> => {
  const annotated: any = {}
  for (const [protocolKey, strategyActions] of Object.entries(actions)) {
    annotated[protocolKey] = {}
    for (const [actionKey, action] of Object.entries(strategyActions)) {
      annotated[protocolKey][actionKey] = annotate(action, [
        chainPrefix,
        protocolKey,
        actionKey,
      ])
    }
  }
  return annotated
}
