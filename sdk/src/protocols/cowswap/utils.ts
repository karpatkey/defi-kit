import { contractAddressOverrides, contracts } from "../../../eth-sdk/config"
import { Chain } from "../../types"

export const getWrappedNativeToken = (chain: Chain): `0x${string}` => {
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
