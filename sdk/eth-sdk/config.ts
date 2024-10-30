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
      abptV2: "0x3de27EFa2F1AA663Ae5D458857e731c129069F29",
      stkaave: "0x4da27a545c0c5b758a6ba100e3a049001de870f5",
      stkabptV2: "0x9eDA81C21C273a82BE9Bbc19B6A6182212068101",
      governanceV2: "0xEC568fffba86c094cf06b22134B23074DFE2252c",
      aEthAAVE: "0xA700b4eB416Be35b2911fd5Dee80678ff64fF6C9",
      gho: "0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f",
      stkgho: "0x1a88Df1cFe15Af22B3c4c783D4e6F7F9e0C1885d",
    },
    aaveV3: {
      data_provider: "0x41393e5e337606dc3821075Af65AeE84D7688CBD",
      aaveLendingPoolV3: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
      wrappedTokenGatewayV3: "0xA434D495249abE33E031Fe71a969B81f3c07950D",
      aEthWETH: "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8",
      variableDebtWETH: "0xeA51d7853EEFb32b6ee06b1C12E6dcCA88Be0fFE",
      stableDebtWETH: "0x0000000000000000000000000000000000000000",
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
      relayer: "0x35Cea9e57A393ac66Aaa7E25C391D52C74B5648f",
      relayerLibrary: "0xeA66501dF1A00261E3bB79D1E90444fc6A186B62",
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
      RewardsController: "0x4370D3b6C9588E02ce9D22e684387859c7Ff5b34",
      MigrationActions: "0xf86141a5657Cf52AEB3E30eBccA5Ad3a8f714B89",
      USDS: "0xdC035D45d973E3EC169d2276DDab16f1e407384F",
      sUSDS: "0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD",
    },
    stader: {
      staking_pool_manager: "0xcf5EA1b38380f6aF39068375516Daf40Ed70D299",
      user_withdraw_manager: "0x9F0491B32DBce587c50c4C43AB303b06478193A7",
      ETHx: "0xA35b1B31Ce002FBF2058D22F30f95D405200A15b",
    },
    stakewise_v2: {
      merkle_distributor: "0xA3F21010e8b9a3930996C8849Df38f9Ca3647c20",
      seth2: "0xFe2e637202056d30016725477c5da089Ab0A043A",
      reth2: "0x20BC832ca081b91433ff6c17f85701B6e92486c5",
      swise: "0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2",
    },
    uniswap_v3: {
      positions_nft: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
      factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      pool: "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8", // USDC/ETH 0.3%
    },
    dai: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  gnosis: {
    spark: {
      SavingsXDaiAdapter: "0xD499b51fcFc66bd31248ef4b28d656d67E591A94",
    },
  },
} as const satisfies EthSdkConfig["contracts"]

export const contractAddressOverrides = {
  gnosis: {
    aaveV3: {
      data_provider: "0x57038C3e3Fe0a170BB72DE2fD56E98e4d1a69717",
      aaveLendingPoolV3: "0xb50201558B00496A145fE76f7424749556E326D8",
      wrappedTokenGatewayV3: "0x90127A46207e97e4205db5CCC1Ec9D6D43633FD4",
      aGnoWXDAI: "0xd0Dd6cEF72143E22cCED4867eb0d5F2328715533",
      variableDebtWXDAI: "0x281963D7471eCdC3A2Bd4503e24e89691cfe420D",
      stableDebtWXDAI: "0x0000000000000000000000000000000000000000"
    },
    aura: {
      booster: "0x98Ef32edd24e2c92525E59afc4475C1242a30184",
      reward_pool_deposit_wrapper: "0x0Fec3d212BcC29eF3E505B555D7a7343DF0B7F76",
    },
    balancer: {
      minter: "0xA8920455934Da4D853faac1f94Fe7bEf72943eF1",
      relayer: "0x2163c2FcD0940e84B8a68991bF926eDfB0Cd926C",
      relayerLibrary: "0x8eA89804145c007e7D226001A96955ad53836087",
    },
    spark: {
      sDAI: "0xaf204776c7245bF4147c2612BF6e5972Ee483701",
      sparkLendingPoolV3: "0x2Dae5307c5E3FD1CF5A72Cb6F698f915860607e0",
      wrappedTokenGatewayV3: "0xBD7D6a9ad7865463DE44B05F04559f65e3B11704",
      spWXDAI: "0xC9Fe2D32E96Bb364c7d29f3663ed3b27E30767bB",
      variableDebtWXDAI: "0x868ADfDf12A86422524EaB6978beAE08A0008F37",
      RewardsController: "0x4370D3b6C9588E02ce9D22e684387859c7Ff5b34",
    },
    wxdai: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
  },
  arbitrumOne: {
    aaveV3: {
      data_provider: "0x7F23D86Ee20D869112572136221e173428DD740B",
      aaveLendingPoolV3: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
      wrappedTokenGatewayV3: "0x5760E34c4003752329bC77790B1De44C2799F8C3",
      aArbWETH: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
      variableDebtWETH: "0x0c84331e39d6658Cd6e6b9ba04736cC4c4734351",
      stableDebtWETH: "0x0000000000000000000000000000000000000000",
    },
    balancer: {
      minter: "0xc3ccacE87f6d3A81724075ADcb5ddd85a8A1bB68",
      relayer: "0x9B892E515D2Ab8869F17488d64B3b918731cc70d",
      relayerLibrary: "0x4b7b369989e613ff2C65768B7Cf930cC927F901E",
    },
    cowswap: {
      orderSigner: "0x23dA9AdE38E4477b23770DeD512fD37b12381FAB",
    },
    weth: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
  },
} as const satisfies EthSdkConfig["contracts"]

export default defineConfig({
  etherscanURLs: {
    gnosis: "https://api.gnosisscan.io/api",
    //gnosis: "https://blockscout.com/xdai/mainnet/api",
  },
  rpc: {
    gnosis: "https://rpc.gnosischain.com/",
    //gnosis: "https://rpc.ankr.com/gnosis"
  },
  contracts,
})
