import { contracts } from "../../../eth-sdk/config"
import { Chain } from "../../types"

export const getWrappedNativeToken = (chain: Chain): `0x${string}` => {
  switch (chain) {
    case Chain.eth:
      return contracts.mainnet.weth
    case Chain.gno:
      return contracts.gnosis.wxdai
    case Chain.arb1:
      return contracts.arbitrumOne.weth
    default:
      throw new Error("No chainId found")
  }
}
