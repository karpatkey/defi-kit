export default [
  {
    address: "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
    symbol: "cUSDCv3",
    borrowToken: {
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      symbol: "USDC",
    },
    collateralTokens: [
      {
        address: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
        symbol: "COMP",
      },
      {
        address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        symbol: "WBTC",
      },
      {
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        symbol: "ETH",
      },
      {
        address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        symbol: "UNI",
      },
      {
        address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        symbol: "LINK",
      },
    ],
  },
  {
    address: "0xA17581A9E3356d9A858b789D68B4d866e593aE94",
    symbol: "cWETHv3",
    borrowToken: {
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      symbol: "ETH",
    },
    collateralTokens: [
      {
        address: "0xBe9895146f7AF43049ca1c1AE358B0541Ea49704",
        symbol: "cbETH",
      },
      {
        address: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
        symbol: "wstETH",
      },
    ],
  },
] as const
