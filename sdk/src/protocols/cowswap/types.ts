import { contractAddressOverrides, contracts } from "../../../eth-sdk/config"

export type WethAddress =
  | typeof contracts.mainnet.weth
  | (typeof contractAddressOverrides)[keyof typeof contractAddressOverrides]["weth"]

export type OrderSignerAddress =
  | typeof contracts.mainnet.cowswap.orderSigner
  | typeof contractAddressOverrides.arbitrumOne.cowswap.orderSigner
