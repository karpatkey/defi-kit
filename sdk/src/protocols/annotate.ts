import { PermissionSet } from "zodiac-roles-sdk"
import { ProtocolActions, ActionFunction } from "../types"

type Annotated<F extends ActionFunction> = (
  params: Parameters<F>[0]
) => Promise<PermissionSet>

const annotate = <F extends ActionFunction>(
  actionFunction: F,
  path: string[]
): Annotated<F> => {
  const annotated = async (params: any) => {
    const result = await actionFunction(params)

    const queryString = new URLSearchParams(params).toString()
    const joinedPath = path.join("/")
    Object.assign(result, {
      annotation: {
        uri: `https://kit.karpatkey.com/api/v1/permissions/${joinedPath}?${queryString}`,
        schema: "https://kit.karpatkey.com/api/v1/openapi.json",
      },
    })

    return result
  }

  return annotated as (params: Parameters<F>[0]) => Promise<PermissionSet>
}

type AllAnnotated<R extends Record<string, ProtocolActions>> = {
  [P in keyof R]: R[P] extends ProtocolActions
    ? {
        [Key in keyof R[P]]: R[P][Key] extends ActionFunction
          ? Annotated<R[P][Key]>
          : undefined
      }
    : undefined
}

export const annotateAll = <R extends Record<string, ProtocolActions>>(
  actions: R,
  chainPrefix: string
): AllAnnotated<R> => {
  const annotated: any = {}
  for (const [protocolKey, protocolActions] of Object.entries(actions)) {
    annotated[protocolKey] = {}
    for (const [actionKey, action] of Object.entries(protocolActions)) {
      annotated[protocolKey][actionKey] = annotate(action, [
        chainPrefix,
        protocolKey,
        actionKey,
      ])
    }
  }
  return annotated
}
