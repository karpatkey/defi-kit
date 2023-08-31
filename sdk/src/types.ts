import { SomeZodObject } from "zod"
import { Permission } from "zodiac-roles-sdk"

export enum Chain {
  eth = "eth",
  gor = "gor",
}

interface DepositOptions {
  /** The deposit target, an AMM pool, specific money market identified by either name or address */
  targets: any[]

  /** A list of tokens that can be deposited, identified by symbol or address. If not set all tokens of the pool are allowed. */
  tokens?: any[]
}

interface BorrowOptions {
  /** The tokens that can be borrowed */
  tokens: any[]
}

interface StakeOptions {
  targets: any[]
}

interface ClaimOptions {}

interface LockOptions {}

interface DelegateOptions {
  targets: any[]
  delegatee: any
}

type SwapOptions =
  | {
      /** List of tokens that can be sold, identified by symbol or address. */
      sell: any[]
      /** List of tokens that can be bought, identified by symbol or address. */
      buy: any[]
      /** List of pools that can be used, identified by name or address. If not set it will generate permissions for all pools containing any pair of the sell and buy tokens. */
      pools?: any[]
    }
  | {
      /** List of tokens that can be sold, identified by symbol or address. If not set all tokens in the listed pools can be sold. */
      sell?: any[]
      /** List of tokens that can be bought, identified by symbol or address. If not set all tokens in the listed pools can be bought. */
      buy?: any[]
      /** List of pools that can be used, identified by name or address. */
      pools: any[]
    }

// These types define the common interface for actions across all protocols
export type ProtocolActions = {
  deposit?: (options: DepositOptions) => Permission[]

  borrow?: (options: BorrowOptions) => Permission[]

  stake?: (options: StakeOptions) => Permission[]

  claim?: (options: ClaimOptions) => Permission[]

  swap?: (options: SwapOptions) => Permission[]

  lock?: (options: LockOptions) => Permission[]

  delegate?: (options: DelegateOptions) => Permission[]
}

export type ActionName = keyof ProtocolActions

// For registering protocols in the REST API we need zod schemas for the specific parameters of each action
export type ProtocolSchemas = { [key in ActionName]?: SomeZodObject }
