export default [
  {
    name: "ETH-sETH2 0.3%",
    address: "0x7379e81228514a1D2a6Cf7559203998E20598346",
    fee: "0.3%",
    tokens: [
      {
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        symbol: "WETH",
      },
      {
        address: "0xFe2e637202056d30016725477c5da089Ab0A043A",
        symbol: "sETH2",
      },
    ],
  },
  {
    name: "rETH2-sETH2 0.05%",
    address: "0xa9ffb27d36901F87f1D0F20773f7072e38C5bfbA",
    fee: "0.05%",
    tokens: [
      {
        address: "0x20BC832ca081b91433ff6c17f85701B6e92486c5",
        symbol: "rETH2",
      },
      {
        address: "0xFe2e637202056d30016725477c5da089Ab0A043A",
        symbol: "sETH2",
      },
    ],
  },
  {
    name: "SWISE-ETH 0.3%",
    fee: "0.3%",
    address: "0x2aF41D838763E3c5cad6AdC111af9c5dA19B9AFa",
    tokens: [
      {
        address: "0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2",
        symbol: "SWISE",
      },
      {
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        symbol: "WETH",
      },
    ],
  },
  {
    name: "SWISE-sETH2 0.3%",
    fee: "0.3%",
    address: "0x992f534fcc87864875224d142d6Bf054B1882160",
    tokens: [
      {
        address: "0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2",
        symbol: "SWISE",
      },
      {
        address: "0xFe2e637202056d30016725477c5da089Ab0A043A",
        symbol: "sETH2",
      },
    ],
  },
] as const