export default [
    {
        symbol: 'cUSDCv3',
        address: '0x...', // USDC comet address
        borrowToken: [
            { symbol: 'USDC', address: '0x'}
        ],
        collateralTokens: [
            {
                address: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
                symbol: "COMP"
            },
            {
                address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
                symbol: "WBTC"
            },
            {
                address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                symbol: "ETH"
            },
            {
                address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
                symbol: "UNI"
            },
            {
                address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
                symbol: "LINK"
            }
        ]
    },
//    {
//     name: 'cETHv3',
//     address: '0x...',
//    }
] as const

