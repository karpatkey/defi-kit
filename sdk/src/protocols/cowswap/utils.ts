import { contractAddressOverrides, contracts } from "../../../eth-sdk/config"
import { Chain } from "../../types"
import { OrderSignerAddress, WethAddress } from "./types"

export const getWrappedNativeToken = (chain: Chain): WethAddress => {
  switch (chain) {
    case Chain.eth:
      return contracts.mainnet.weth
    case Chain.gno:
      return contractAddressOverrides.gnosis.wxdai
    case Chain.arb1:
      return contractAddressOverrides.arbitrumOne.weth
    default:
      throw new Error("No chainId found")
  }
}

export const getOrderSignerAddressByChain = (
  chain: Chain
): OrderSignerAddress => {
  switch (chain) {
    case Chain.eth:
      return contracts.mainnet.cowswap.orderSigner
    case Chain.gno:
      return contracts.mainnet.cowswap.orderSigner
    case Chain.arb1:
      return contractAddressOverrides.arbitrumOne.cowswap.orderSigner
    default:
      throw new Error("No chainId found")
  }
}
