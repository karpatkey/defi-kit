import { EthSdkConfig, defineConfig } from "@dethcrypto/eth-sdk"

export const contracts = {
  mainnet: {
    aaveV2: {
      aaveLendingPoolV2: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",
      paraSwapRepayAdapter: "0x80Aca0C645fEdABaa20fd2Bf0Daf57885A309FE6",
      wrappedTokenGatewayV2: "0xEFFC18fC3b7eb8E676dac549E0c693ad50D1Ce31",
      aave: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
      abpt: "0x41A08648C3766F9F9d85598fF102a08f4ef84F84",
      stkaave: "0x4da27a545c0c5b758a6ba100e3a049001de870f5",
      stkabpt: "0xa1116930326D21fB917d5A27F1E9943A9595fb47",
    },
    curve: {
      regularPool: "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
      metaPool: "0x4f062658eaaf2c1ccf8c8e36d6824cdf41167956",
    },
    lido: {
      steth: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
      wsteth: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
    },
    balancer: {
      relayer: "0xfeA793Aa415061C483D2390414275AD314B3F621",
      relayerLibrary: "0xf77018c0d817dA22caDbDf504C00c0d32cE1e5C2",
    },
  },
  goerli: {
    cowswap: {
      orderSigner: "0xdEb83d81d4a9758A7bAec5749DA863C409ea6C6B",
    },
  },
} satisfies EthSdkConfig["contracts"]

export default defineConfig({
  contracts,
})
