import {
  getMainnetSdk,
  getOptimismSdk,
  getGnosisSdk,
  getBaseSdk,
  getArbitrumOneSdk,
} from "@gnosis-guild/eth-sdk-client"
import * as providers from "./provider"

export const sdks = {
  [1]: getMainnetSdk(providers.ethProvider),
  [10]: getOptimismSdk(providers.oethProvider),
  [100]: getGnosisSdk(providers.gnoProvider),
  [8453]: getBaseSdk(providers.baseProvider),
  [42161]: getArbitrumOneSdk(providers.arb1Provider),
}