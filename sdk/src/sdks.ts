import {
  getMainnetSdk,
  getOptimismSdk,
  getGnosisSdk,
  getBaseSdk,
  getArbitrumOneSdk,
} from "@gnosis-guild/eth-sdk-client"
import * as providers from "./provider"
import { Chain } from "../src/types"

export const sdks = {
  [Chain.eth]: getMainnetSdk(providers.ethProvider),
  [Chain.oeth]: getOptimismSdk(providers.oethProvider),
  [Chain.gno]: getGnosisSdk(providers.gnoProvider),
  [Chain.base]: getBaseSdk(providers.baseProvider),
  [Chain.arb1]: getArbitrumOneSdk(providers.arb1Provider),
}
