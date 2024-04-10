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
  disassemble: {
    [K in keyof S["disassemble"]]: Annotated<S["disassemble"][K]>
  }
}

export const annotateAll = <S extends Strategies>(
  strategies: S,
  chainPrefix: string
): AllAnnotated<S> => {
  const annotated: any = {}
  for (const [categoryName, strategiesInCategory] of Object.entries(
    strategies
  )) {
    annotated[categoryName] = {}
    for (const [strategyName, strategy] of Object.entries(
      strategiesInCategory
    )) {
      annotated[categoryName][strategyName] = annotate(strategy, [
        chainPrefix,
        categoryName,
        strategyName,
      ])
    }
  }
  return annotated
}
