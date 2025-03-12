import {
  getMainnetSdk,
  getOptimismSdk,
  getGnosisSdk,
  getBaseSdk,
  getArbitrumOneSdk,
} from "@gnosis-guild/eth-sdk-client"
import { getProvider } from "./provider"
import { Chain } from "../src/types"

export const testSdks = {
  [Chain.eth]: getMainnetSdk(getProvider(Chain.eth)),
  [Chain.oeth]: getOptimismSdk(getProvider(Chain.oeth)),
  [Chain.gno]: getGnosisSdk(getProvider(Chain.gno)),
  [Chain.base]: getBaseSdk(getProvider(Chain.base)),
  [Chain.arb1]: getArbitrumOneSdk(getProvider(Chain.arb1)),
}

