import { SomeZodObject } from "zod"
import { Permission } from "zodiac-roles-sdk"

export enum Chain {
  eth = "eth",
  gno = "gno",
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
}

export type Strategies = {
  exit: {
    [category: string]: {
      [name: string]: AllowFunction
    }
  }
}

export type ActionName = keyof ProtocolActions

// For registering protocols in the REST API we need zod schemas for the specific parameters of each action
export type ProtocolSchemas = {
  [protocol: string]: {
    [key in ActionName]?: SomeZodObject
  }
}

// ... same for strategies
export type StrategySchemas = {
  exit: {
    [category: string]: {
      [name: string]: SomeZodObject
    }
  }
}
