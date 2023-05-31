import { defineConfig } from "@dethcrypto/eth-sdk"

export default defineConfig({
  contracts: {
    mainnet: {
      aave_v2: {
        AaveLendingPoolV2: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",
        ParaSwapRepayAdapter: "0x80Aca0C645fEdABaa20fd2Bf0Daf57885A309FE6",
        WrappedTokenGatewayV2: "0xEFFC18fC3b7eb8E676dac549E0c693ad50D1Ce31",
        AAVE: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
        ABPT: "0x41A08648C3766F9F9d85598fF102a08f4ef84F84",
        stkAAVE: "0x4da27a545c0c5b758a6ba100e3a049001de870f5",
        stkABPT: "0xa1116930326D21fB917d5A27F1E9943A9595fb47",
      },
      curve: {
        regularPool: "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
        metaPool: "0x4f062658eaaf2c1ccf8c8e36d6824cdf41167956",
      },
    },
    goerli: {
      cowswap: {
        orderSigner: "0xdEb83d81d4a9758A7bAec5749DA863C409ea6C6B",
      },
    },
  },
})
