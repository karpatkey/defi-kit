import { SomeZodObject } from "zod"
import { PermissionSet } from "zodiac-roles-sdk"

export enum Chain {
  eth = "eth",
  gor = "gor",
}

interface DepositOptions {
  /** The deposit target, an AMM pool, specific money market, or vault identified by either name or address */
  targets: any[]

  /** A list of tokens that can be deposited, identified by symbol or address. If not set all tokens supported by the `targets` are allowed. */
  tokens?: any[]
}

interface BorrowOptions {
  /** The specific vaults from which borrowing is allowed. If not set any accessible vault is allowed. */
  targets?: any[]
  /** The tokens that can be borrowed, identified by symbol or address. If not set all tokens available through the `targets` are allowed. */
  tokens?: any[]
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
  deposit?: (options: DepositOptions) => PermissionSet

  borrow?: (options: BorrowOptions) => PermissionSet

  stake?: (options: StakeOptions) => PermissionSet

  claim?: (options: ClaimOptions) => PermissionSet

  swap?: (options: SwapOptions) => PermissionSet

  lock?: (options: LockOptions) => PermissionSet

  delegate?: (options: DelegateOptions) => PermissionSet
}

export type ActionName = keyof ProtocolActions
export type ActionFunction = NonNullable<ProtocolActions[ActionName]>

// For registering protocols in the REST API we need zod schemas for the specific parameters of each action
export type ProtocolSchemas = { [key in ActionName]?: SomeZodObject }
