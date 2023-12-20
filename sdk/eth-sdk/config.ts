import { EthSdkConfig, defineConfig } from "@dethcrypto/eth-sdk"

export const contracts = {
  mainnet: {
    aaveV2: {
      aaveLendingPoolV2: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",
      paraSwapRepayAdapter: "0x80Aca0C645fEdABaa20fd2Bf0Daf57885A309FE6",
      wrappedTokenGatewayV2: "0xEFFC18fC3b7eb8E676dac549E0c693ad50D1Ce31",
      variableDebtWETH: "0xF63B34710400CAd3e044cFfDcAb00a0f32E33eCf",
      stableDebtWETH: "0x4e977830ba4bd783C0BB7F15d3e243f73FF57121",
      aave: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
      abpt: "0x41A08648C3766F9F9d85598fF102a08f4ef84F84",
      stkaave: "0x4da27a545c0c5b758a6ba100e3a049001de870f5",
      stkabpt: "0xa1116930326D21fB917d5A27F1E9943A9595fb47",
      governanceV2: "0xEC568fffba86c094cf06b22134B23074DFE2252c",
      governanceV2Helper: "0xBb7baf0534423e3108E1D03c259104cDba2C1cB7",
    },
    aaveV3: {
      aaveLendingPoolV3: "0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2",
      wrappedTokenGatewayV3: "0xD322A49006FC828F9B5B37Ab215F99B4E5caB19C",
      aEthWETH: "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8",
      variableDebtWETH: "0xeA51d7853EEFb32b6ee06b1C12E6dcCA88Be0fFE",
      stableDebtWETH: "0x102633152313C81cD80419b6EcF66d14Ad68949A",
    },
    aura: {
      booster: "0xA57b8d98dAE62B26Ec3bcC4a365338157060B234",
      reward_pool_deposit_wrapper: "0xB188b1CB84Fb0bA13cb9ee1292769F903A9feC59",
      bal_depositor_wrapper: "0x68655AD9852a99C87C0934c7290BB62CFa5D4123",
      b_80bal_20weth_depositor_wrapper:
        "0xeAd792B55340Aa20181A80d6a16db6A0ECd1b827",
      aurabal_staking_rewarder: "0x00A7BA8Ae7bca0B10A32Ea1f8e2a1Da980c6CAd2",
      stkaurabal: "0xfAA2eD111B4F580fCb85C48E6DC6782Dc5FCD7a6",
      aurabal_staker: "0xa3fCaFCa8150636C3B736A16Cd73d49cC8A7E10E",
      aurabal_compounding_rewarder:
        "0xAc16927429c5c7Af63dD75BC9d8a58c63FfD0147",
      aura_locker: "0x3Fa73f1E5d8A792C80F426fc8F84FBF7Ce9bBCAC",
      rewarder: "0x59D66C58E83A26d6a0E35114323f65c3945c89c1",
    },
    balancer: {
      relayer: "0xfeA793Aa415061C483D2390414275AD314B3F621",
      relayerLibrary: "0xf77018c0d817dA22caDbDf504C00c0d32cE1e5C2",
      vault: "0xba12222222228d8ba445958a75a0704d566bf2c8",
      gauge: "0xcD4722B7c24C29e0413BDCd9e51404B4539D14aE",
      minter: "0x239e55F427D44C3cc793f49bFB507ebe76638a2b",
      vebal: "0xC128a9954e6c874eA3d62ce62B468bA073093F25",
      fee_distributor: "0xD3cf852898b21fc233251427c2DC93d3d604F3BB",
    },
    compoundV2: {
      comptroller: "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b",
      maximillion: "0xf859A1AD94BcF445A406B892eF0d3082f4174088",
      cToken: "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
    },
    compoundV3: {
      comet: "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
      MainnetBulker: "0xa397a8C2086C554B531c02E29f3291c9704B00c7",
      CometRewards: "0x1b0e765f6224c21223aea2af16c1c46e38885a40",
    },
    convex: {
      booster: "0xF403C135812408BFbE8713b5A23a04b3D48AAE31",
      cvxCRV: "0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7",
      rewarder: "0x0A760466E1B4621579a82a39CB56Dda2F4E70f03",
      CrvDepositor: "0x8014595F2AB54cD7c604B00E9fb932176fDc86Ae",
      stkCvxCrv: "0xaa0C3f5F7DFD688C6E646F66CD2a6B66ACdbE434",
      cvxRewardPool: "0xCF50b810E57Ac33B91dCF525C6ddd9881B139332",
      vlCVX: "0x72a19342e8F1838460eBFCCEf09F6585e32db86E",
    },
    cowswap: {
      orderSigner: "0xdEb83d81d4a9758A7bAec5749DA863C409ea6C6B",
    },
    curve: {
      regularPool: "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
      metaPool: "0x4f062658eaaf2c1ccf8c8e36d6824cdf41167956",
    },
    lido: {
      steth: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
      wsteth: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
      unsteth: "0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1",
    },
    maker: {
      DsProxy: "0xD758500ddEc05172aaA035911387C8E0e789CF6a", // GnosisDAO DSProxy
      ProxyActions: "0x82ecd135dce65fbc6dbdd0e4237e0af93ffd5038",
      ProxyRegistry: "0x4678f0a6958e4D2Bc4F1BAF7Bc52E8F3564f3fE4",
      CdpManager: "0x5ef30b9986345249bc32d8928B7ee64DE9435E39",
      Jug: "0x19c0976f590D67707E62397C87829d896Dc0f1F1",
      DaiJoin: "0x9759A6Ac90977b93B58547b4A71c78317f391A28",
    },
    spark: {
      sparkLendingPoolV3: "0xC13e21B648A5Ee794902342038FF3aDAB66BE987",
      wrappedTokenGatewayV3: "0xBD7D6a9ad7865463DE44B05F04559f65e3B11704",
      variableDebtWETH: "0x2e7576042566f8D6990e07A1B61Ad1efd86Ae70d",
      stableDebtWETH: "0x3c6b93D38ffA15ea995D1BC950d5D0Fa6b22bD05",
      sDAI: "0x83F20F44975D03b1b09e64809B757c47f942BEeA",
    },
    weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
} satisfies EthSdkConfig["contracts"]

export default defineConfig({
  contracts,
})
