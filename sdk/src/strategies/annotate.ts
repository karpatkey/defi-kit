import { PermissionSet } from "zodiac-roles-sdk"
import { AllowFunction, Strategies } from "../types"

type Annotated<F extends AllowFunction> = (
  ...args: Parameters<F>
) => Promise<PermissionSet>

const annotate = <F extends AllowFunction>(
  strategyFunction: F,
  path: string[]
): Annotated<F> => {
  const annotated = async (params: any) => {
    const result = await strategyFunction(params)

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

type AllAnnotated<S extends Strategies> = {
  exit: {
    [C in keyof S["exit"]]: {
      [K in keyof S["exit"][C]]: Annotated<S["exit"][C][K]>
    }
  }
}

export const annotateAll = <S extends Strategies>(
  strategies: S,
  chainPrefix: string
): AllAnnotated<S> => {
  const annotated: any = {}
  for (const [type, strategiesOfType] of Object.entries(strategies)) {
    annotated[type] = {}
    for (const [category, strategiesInCategory] of Object.entries(
      strategiesOfType
    )) {
      annotated[type][category] = {}
      for (const [strategyName, strategy] of Object.entries(
        strategiesInCategory
      )) {
        annotated[type][category][strategyName] = annotate(strategy, [
          chainPrefix,
          type,
          category,
          strategyName,
        ])
      }
    }
  }
  return annotated
}
