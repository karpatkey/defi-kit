export default [
    {
        marketId: "0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e",
        loanToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",//WETH9
        collateralToken: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",//WstETH
        oracle: "0xbD60A6770b27E084E8617335ddE769241B0e71D8",//MorphoChainlinkOracleV2
        irm: "0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC", //AdaptiveCurveIrm
        lltv: "965000000000000000",
    },
] as const;