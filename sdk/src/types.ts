import { SomeZodObject } from "zod"
import { Permission } from "zodiac-roles-sdk"

export enum Chain {
  eth = "eth",
  gno = "gno",
  arb1 = "arb1",
}

export type ActionFunction = (options: any) => Promise<Permission[]>

export type ProtocolActions = {
  deposit?: ActionFunction

  borrow?: ActionFunction

  stake?: ActionFunction

  claim?: ActionFunction

  swap?: ActionFunction

  lock?: ActionFunction

  delegate?: ActionFunction
}

export type ActionName = keyof ProtocolActions

// For registering protocols in the REST API we need zod schemas for the specific parameters of each action
export type ProtocolSchemas = { [key in ActionName]?: SomeZodObject }
