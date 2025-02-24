import { SomeZodObject } from "zod"
import { Permission } from "zodiac-roles-sdk"

export enum Chain {
  eth = "eth",
  gno = "gno",
  arb1 = "arb1",
  oeth = "oeth",
  base = "base",
}

export type AllowFunction = (options: any) => Promise<Permission[]>

export type ProtocolActions = {
  deposit?: AllowFunction
  borrow?: AllowFunction
  stake?: AllowFunction
  claim?: AllowFunction
  swap?: AllowFunction
  lock?: AllowFunction
  delegate?: AllowFunction
  supply?: AllowFunction
}

export type ActionName = keyof ProtocolActions

export type RepertoireActions = {
  [name: string]: AllowFunction
}

export type Repertoire = {
  [protocol: string]: RepertoireActions
}

// For registering protocols in the REST API we need zod schemas for the specific parameters of each action
export type ProtocolSchemas = {
  [protocol: string]: {
    [key in ActionName]?: SomeZodObject
  }
}

// ... same for repertoire actions
export type RepertoireSchemas = {
  [protocol: string]: {
    [name: string]: SomeZodObject
  }
}
