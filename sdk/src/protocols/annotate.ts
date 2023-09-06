import { ProtocolActions, ActionFunction } from "../types"

const annotate = <F extends ActionFunction>(
  actionFunction: F,
  path: string[]
): F => {
  const annotated = (params: any) => {
    const result = actionFunction(params)

    const queryString = new URLSearchParams(params).toString()
    const joinedPath = path.join("/")
    Object.assign(result, {
      annotation: {
        uri: `https://kit.karpatkey.com/permissions/${joinedPath}?${queryString}`,
        schema: "https://kit.karpatkey.com/api/v1/openapi.json",
      },
    })

    return result
  }

  return annotated as F
}

export const annotateAll = <A extends Record<string, ProtocolActions>>(
  actions: A,
  chainPrefix: string
): A => {
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
