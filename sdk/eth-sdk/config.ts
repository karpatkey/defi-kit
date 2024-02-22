import { EthSdkConfig, defineConfig } from "@dethcrypto/eth-sdk"

export const contracts = {
  mainnet: {
    aaveV2: {
      data_provider: "0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d",
      aaveLendingPoolV2: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",
      paraSwapRepayAdapter: "0x80Aca0C645fEdABaa20fd2Bf0Daf57885A309FE6",
      wrappedTokenGatewayV2: "0xEFFC18fC3b7eb8E676dac549E0c693ad50D1Ce31",
      aWETH: "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e",
      variableDebtWETH: "0xF63B34710400CAd3e044cFfDcAb00a0f32E33eCf",
      stableDebtWETH: "0x4e977830ba4bd783C0BB7F15d3e243f73FF57121",
      aave: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
      abpt: "0x41A08648C3766F9F9d85598fF102a08f4ef84F84",
      stkaave: "0x4da27a545c0c5b758a6ba100e3a049001de870f5",
      stkabpt: "0xa1116930326D21fB917d5A27F1E9943A9595fb47",
      governanceV2: "0xEC568fffba86c094cf06b22134B23074DFE2252c",
      aEthAAVE: "0xA700b4eB416Be35b2911fd5Dee80678ff64fF6C9",
    },
    aaveV3: {
      data_provider: "0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3",
      aaveLendingPoolV3: "0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2",
      wrappedTokenGatewayV3: "0xD322A49006FC828F9B5B37Ab215F99B4E5caB19C",
      aEthWETH: "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8",
      variableDebtWETH: "0xeA51d7853EEFb32b6ee06b1C12E6dcCA88Be0fFE",
      stableDebtWETH: "0x102633152313C81cD80419b6EcF66d14Ad68949A",
    },
    ankr: {
      ETH2_Staking: "0x84db6ee82b7cf3b47e8f19270abde5718b936670",
      flashUnstake: "0xf047f23ACFdB1315cF63Ad8aB5146d5fDa4267Af",
      ankrETH: "0xE95A203B1a91a908F9B9CE46459d101078c2c3cb",
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
      cETH: "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5",
      cToken: "0x39AA39c021dfbaE8faC545936693aC917d5E7563",
    },
    compoundV3: {
      cUSDCv3: "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
      cWETHv3: "0xA17581A9E3356d9A858b789D68B4d866e593aE94",
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
      orderSigner: "0x23dA9AdE38E4477b23770DeD512fD37b12381FAB",
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
      GemJoin: "0x2F0b23f53734252Bda2277357e97e1517d6B042A",
    },
    rocket_pool: {
      storage: "0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46",
      rETH: "0xae78736Cd615f374D3085123A210448E74Fc6393",
      deposit_pool: "0xDD3f50F8A6CafbE9b31a427582963f465E745AF8", // This address might due to Rocket Pool's Architecture
      swap_router: "0x16D5A408e807db8eF7c578279BEeEe6b228f1c1C",
    },
    spark: {
      data_provider: "0xFc21d6d146E6086B8359705C8b28512a983db0cb",
      sparkLendingPoolV3: "0xC13e21B648A5Ee794902342038FF3aDAB66BE987",
      wrappedTokenGatewayV3: "0xBD7D6a9ad7865463DE44B05F04559f65e3B11704",
      variableDebtWETH: "0x2e7576042566f8D6990e07A1B61Ad1efd86Ae70d",
      stableDebtWETH: "0x3c6b93D38ffA15ea995D1BC950d5D0Fa6b22bD05",
      spWETH: "0x59cD1C87501baa753d0B5B5Ab5D8416A45cD71DB",
      sDAI: "0x83F20F44975D03b1b09e64809B757c47f942BEeA",
    },
    stader: {
      staking_pool_manager: "0xcf5EA1b38380f6aF39068375516Daf40Ed70D299",
      user_withdraw_manager: "0x9F0491B32DBce587c50c4C43AB303b06478193A7",
      ETHx: "0xA35b1B31Ce002FBF2058D22F30f95D405200A15b",
    },
    dai: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
} as const satisfies EthSdkConfig["contracts"]

export const contractAddressOverrides = {
  gnosis: {
    aura: {
      booster: "0x98Ef32edd24e2c92525E59afc4475C1242a30184",
      reward_pool_deposit_wrapper: "0x0Fec3d212BcC29eF3E505B555D7a7343DF0B7F76",
    },
  },
}

export default defineConfig({
  contracts,
})
