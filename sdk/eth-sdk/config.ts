import { defineConfig } from "@dethcrypto/eth-sdk"

export default defineConfig({
  contracts: {
    mainnet: {
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
