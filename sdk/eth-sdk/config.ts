import { EthSdkConfig, defineConfig } from "@gnosis-guild/eth-sdk"

export const contracts = {
  mainnet: {
    aaveV2: {
      protocolDataProviderV2: "0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d",
      poolV2: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",
      wrappedTokenGatewayV2: "0xEFFC18fC3b7eb8E676dac549E0c693ad50D1Ce31",
      aWeth: "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e",
      variableDebtWeth: "0xF63B34710400CAd3e044cFfDcAb00a0f32E33eCf",
      stableDebtWeth: "0x4e977830ba4bd783C0BB7F15d3e243f73FF57121",
      aave: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
      abptV2: "0x3de27EFa2F1AA663Ae5D458857e731c129069F29",
      stkAave: "0x4da27a545c0c5b758a6ba100e3a049001de870f5",
      stkAbptV2: "0x9eDA81C21C273a82BE9Bbc19B6A6182212068101",
      aEthAave: "0xA700b4eB416Be35b2911fd5Dee80678ff64fF6C9",
      gho: "0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f",
      stkGho: "0x1a88Df1cFe15Af22B3c4c783D4e6F7F9e0C1885d",
    },
    aaveV3: {
      protocolDataProviderCoreV3: "0x41393e5e337606dc3821075Af65AeE84D7688CBD",
      poolCoreV3: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
      wrappedTokenGatewayCoreV3: "0xA434D495249abE33E031Fe71a969B81f3c07950D",
      aEthWeth: "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8",
      variableDebtWeth: "0xeA51d7853EEFb32b6ee06b1C12E6dcCA88Be0fFE",
      poolPrimeV3: "0x4e033931ad43597d96D6bcc25c280717730B58B1",
      wrappedTokenGatewayPrimeV3: "0x0B8C700917a6991FEa7198dDFC80bc8962b5055D",
      variableDebtEthLidoWeth: "0x91b7d78BF92db564221f6B5AeE744D1727d1Dd1e",
      aEthLidoWeth: "0xfA1fDbBD71B0aA16162D76914d69cD8CB3Ef92da",
      poolEtherFiV3: "0x0AA97c284e98396202b6A04024F5E2c65026F3c0",
      wrappedTokenGatewayEtherFiV3:
        "0xAB911dFB2bB9e264EE836F30D3367618f8Aef965",
      meritDistributor: "0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae",
      incentivesV3: "0x8164Cc65827dcFe994AB23944CBC90e0aa80bFcb",
    },
    ankr: {
      eth2Staking: "0x84db6ee82b7cf3b47e8f19270abde5718b936670",
      flashUnstake: "0xf047f23ACFdB1315cF63Ad8aB5146d5fDa4267Af",
      ankrEth: "0xE95A203B1a91a908F9B9CE46459d101078c2c3cb",
    },
    aura: {
      booster: "0xA57b8d98dAE62B26Ec3bcC4a365338157060B234",
      rewardPoolDepositWrapper: "0xB188b1CB84Fb0bA13cb9ee1292769F903A9feC59",
      balDepositorWrapper: "0x68655AD9852a99C87C0934c7290BB62CFa5D4123",
      b80Bal20WethDepositorWrapper:
        "0xeAd792B55340Aa20181A80d6a16db6A0ECd1b827",
      auraBalStakingRewarder: "0x00A7BA8Ae7bca0B10A32Ea1f8e2a1Da980c6CAd2",
      stkauraBal: "0xfAA2eD111B4F580fCb85C48E6DC6782Dc5FCD7a6",
      auraBalStaker: "0xa3fCaFCa8150636C3B736A16Cd73d49cC8A7E10E",
      auraBalCompoundingRewarder: "0xAc16927429c5c7Af63dD75BC9d8a58c63FfD0147",
      vlAura: "0x3Fa73f1E5d8A792C80F426fc8F84FBF7Ce9bBCAC",
      rewarder: "0x59D66C58E83A26d6a0E35114323f65c3945c89c1",
      claimZapV3: "0x5b2364fD757E262253423373E4D57C5c011Ad7F4",
    },
    balancerV2: {
      relayer: "0x35Cea9e57A393ac66Aaa7E25C391D52C74B5648f",
      relayerLibrary: "0xeA66501dF1A00261E3bB79D1E90444fc6A186B62",
      vault: "0xba12222222228d8ba445958a75a0704d566bf2c8",
      bpt: "0x93d199263632a4EF4Bb438F1feB99e57b4b5f0BD",
      gauge: "0xcD4722B7c24C29e0413BDCd9e51404B4539D14aE",
      minter: "0x239e55F427D44C3cc793f49bFB507ebe76638a2b",
      veBal: "0xC128a9954e6c874eA3d62ce62B468bA073093F25",
      feeDistributor: "0xD3cf852898b21fc233251427c2DC93d3d604F3BB",
    },
    circleV1: {
      tokenMessenger: "0xBd3fa81B58Ba92a82136038B25aDec7066af3155",
      messageTransmitter: "0x0a992d191DEeC32aFe36203Ad87D7d289a738F81",
    },
    compoundV2: {
      comptroller: "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b",
      maximillion: "0xf859A1AD94BcF445A406B892eF0d3082f4174088",
      cEth: "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5",
      cToken: "0x39AA39c021dfbaE8faC545936693aC917d5E7563",
    },
    compoundV3: {
      cUsdcV3: "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
      cUsdtV3: "0x3Afdc9BCA9213A35503b077a6072F3D0d5AB0840",
      cWethV3: "0xA17581A9E3356d9A858b789D68B4d866e593aE94",
      comet: "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
      mainnetBulker: "0xa397a8C2086C554B531c02E29f3291c9704B00c7",
      cometRewards: "0x1b0e765f6224c21223aea2af16c1c46e38885a40",
    },
    convex: {
      booster: "0xF403C135812408BFbE8713b5A23a04b3D48AAE31",
      cvxCrv: "0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7",
      rewarder: "0x0A760466E1B4621579a82a39CB56Dda2F4E70f03",
      crvDepositor: "0x8014595F2AB54cD7c604B00E9fb932176fDc86Ae",
      stkCvxCrv: "0xaa0C3f5F7DFD688C6E646F66CD2a6B66ACdbE434",
      cvxRewardPool: "0xCF50b810E57Ac33B91dCF525C6ddd9881B139332",
      vlCvx: "0x72a19342e8F1838460eBFCCEf09F6585e32db86E",
    },
    cowSwap: {
      orderSigner: "0x23dA9AdE38E4477b23770DeD512fD37b12381FAB",
      gpv2VaultRelayer: "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110",
      vCow: "0xD057B63f5E69CF1B929b356b579Cba08D7688048",
    },
    curve: {
      crvMinter: "0xd061D61a4d941c39E5453435B6345Dc261C2fcE0",
      stakeDepositZap: "0x56C526b0159a258887e0d79ec3a80dfb940d0cD7",
    },
    kelp: {
      LRTDepositPool: "0x036676389e48133B63a802f8635AD39E752D375D",
      ethx: "0xA35b1B31Ce002FBF2058D22F30f95D405200A15b",
      rseth: "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7",
      LRTWithdrawalManager: "0x62De59c08eB5dAE4b7E6F7a8cAd3006d6965ec16",
    },
    lido: {
      stEth: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
      wstEth: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
      unstEth: "0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1",
    },
    sky: {
      dsProxy: "0xD758500ddEc05172aaA035911387C8E0e789CF6a", // GnosisDAO DSProxy
      proxyActions: "0x82ecd135dce65fbc6dbdd0e4237e0af93ffd5038",
      proxyRegistry: "0x4678f0a6958e4D2Bc4F1BAF7Bc52E8F3564f3fE4",
      cdpManager: "0x5ef30b9986345249bc32d8928B7ee64DE9435E39",
      jug: "0x19c0976f590D67707E62397C87829d896Dc0f1F1",
      daiJoin: "0x9759A6Ac90977b93B58547b4A71c78317f391A28",
      gemJoin: "0x2F0b23f53734252Bda2277357e97e1517d6B042A",
      dsrManager: "0x373238337Bfe1146fb49989fc222523f83081dDb",
    },
    morpho: {
      morphoBlue: "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb",
      // publicAllocator: "0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D",
      metaMorpho: "0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658",
    },
    rocketPool: {
      storage: "0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46",
      rEth: "0xae78736Cd615f374D3085123A210448E74Fc6393",
      depositPool: "0xDD3f50F8A6CafbE9b31a427582963f465E745AF8", // This address might due to Rocket Pool's Architecture
      swapRouter: "0x16D5A408e807db8eF7c578279BEeEe6b228f1c1C",
    },
    spark: {
      protocolDataProviderV3: "0xFc21d6d146E6086B8359705C8b28512a983db0cb",
      poolV3: "0xC13e21B648A5Ee794902342038FF3aDAB66BE987",
      wrappedTokenGatewayV3: "0xBD7D6a9ad7865463DE44B05F04559f65e3B11704",
      variableDebtWeth: "0x2e7576042566f8D6990e07A1B61Ad1efd86Ae70d",
      stableDebtWeth: "0x3c6b93D38ffA15ea995D1BC950d5D0Fa6b22bD05",
      spWeth: "0x59cD1C87501baa753d0B5B5Ab5D8416A45cD71DB",
      sDai: "0x83F20F44975D03b1b09e64809B757c47f942BEeA",
      rewardsController: "0x4370D3b6C9588E02ce9D22e684387859c7Ff5b34",
      migrationActions: "0xf86141a5657Cf52AEB3E30eBccA5Ad3a8f714B89",
      usds: "0xdC035D45d973E3EC169d2276DDab16f1e407384F",
      sUsds: "0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD",
      stakingRewards: "0x0650CAF159C5A49f711e8169D4336ECB9b950275",
      psmUsdcSdai: "0x5803199F1085d52D1Bb527f24Dc1A2744e80A979",
      psmUsdcSusds: "0xd0A61F2963622e992e6534bde4D52fd0a89F39E0",
      sUsdc: "0xBc65ad17c5C0a2A4D159fa5a503f4992c7B545FE",
      UsdsPsmWrapper: "0xA188EEC8F81263234dA3622A406892F3D630f98c",
    },
    stader: {
      stakingPoolManager: "0xcf5EA1b38380f6aF39068375516Daf40Ed70D299",
      userWithdrawManager: "0x9F0491B32DBce587c50c4C43AB303b06478193A7",
      ethx: "0xA35b1B31Ce002FBF2058D22F30f95D405200A15b",
    },
    stakeWiseV2: {
      sEth2: "0xFe2e637202056d30016725477c5da089Ab0A043A",
      merkleDistributor: "0xA3F21010e8b9a3930996C8849Df38f9Ca3647c20",
    },
    stakeWiseV3: {
      vault: "0xba0B5ba961B108BFf8D761A256e9763a4FccFF23", // EthVault (Implementation)
    },
    symbiotic: {
      defaultCollateral: "0xa301ea1E3CAB036AbE8fa70e5526A51Cb41799B6",
    },
    uniswapV3: {
      positionsNft: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
      factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      pool: "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8", // USDC/ETH 0.3%
      router2: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    },
    dai: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    wsteth: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
    gnoOmnibridge: "0x88ad09518695c6c3712AC10a214bE5109a655671",
    gnoXdaiBridge: "0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016",
    ambEthXdai: "0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e",
    optDaiBridge: "0x10E6593CDda8c58a1d0f14C5164B376352a55f2F",
    optGateway: "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1",
    arbDaiGateway: "0xD3B5b60020504bc3489D6949d545893982BA3011",
    arbErc20Gateway: "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC",
    l1HopCctp: "0x7e77461CA2a9d82d26FD5e0Da2243BF72eA45747",
    hopDaiBridge: "0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1",
    arbL1GatewayRouter: "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef",
  },
  gnosis: {
    aaveV3: {
      poolV3: "0xb50201558B00496A145fE76f7424749556E326D8",
      wrappedTokenGatewayV3: "0x7B9c12915c594a68dE96201Cbdc79147F09da278",
      aGnoWXDAI: "0xd0Dd6cEF72143E22cCED4867eb0d5F2328715533",
      variableDebtWXDAI: "0x281963D7471eCdC3A2Bd4503e24e89691cfe420D",
      protocolDataProviderV3: "0x57038C3e3Fe0a170BB72DE2fD56E98e4d1a69717",
    },
    aura: {
      booster: "0x98Ef32edd24e2c92525E59afc4475C1242a30184",
      rewardPoolDepositWrapper: "0x0Fec3d212BcC29eF3E505B555D7a7343DF0B7F76",
      rewarder: "0x14A81C9283CC16897DaA3f466847Baa260b770eB",
    },
    balancerV2: {
      vault: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
      minter: "0xA8920455934Da4D853faac1f94Fe7bEf72943eF1",
      relayer: "0x2163c2FcD0940e84B8a68991bF926eDfB0Cd926C",
      relayerLibrary: "0x8eA89804145c007e7D226001A96955ad53836087",
      gauge: "0x27519F69b2Ac912aeb6fE066180FB25a17c71755",
      bpt: "0xbAd20c15A773bf03ab973302F61FAbceA5101f0A",
    },
    cowSwap: {
      orderSigner: "0x23dA9AdE38E4477b23770DeD512fD37b12381FAB",
      gpv2VaultRelayer: "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110",
      vCow: "0xc20C9C13E853fc64d054b73fF21d3636B2d97eaB",
    },
    spark: {
      sDai: "0xaf204776c7245bF4147c2612BF6e5972Ee483701",
      poolV3: "0x2Dae5307c5E3FD1CF5A72Cb6F698f915860607e0",
      wrappedTokenGatewayV3: "0xBD7D6a9ad7865463DE44B05F04559f65e3B11704",
      spWxdai: "0xC9Fe2D32E96Bb364c7d29f3663ed3b27E30767bB",
      variableDebtWxdai: "0x868ADfDf12A86422524EaB6978beAE08A0008F37",
      rewardsController: "0x98e6BcBA7d5daFbfa4a92dAF08d3d7512820c30C",
      savingsXdaiAdapter: "0xD499b51fcFc66bd31248ef4b28d656d67E591A94",
      aWxdai: "0xC9Fe2D32E96Bb364c7d29f3663ed3b27E30767bB",
    },
    stakeWiseV3: {
      vault: "0x00c3C5227402BC4cF383Ae2E6931394dD1e720B4", // GnoVault (Implementation)
    },
    uniswapV3: {
      positionsNft: "0xAE8fbE656a77519a7490054274910129c9244FA3",
    },
    comp: "0xDf6FF92bfDC1e8bE45177DC1f4845d391D3ad8fD",
    gno: "0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb",
    usdc: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
    usdcTransmuter: "0x0392A2F5Ac47388945D8c84212469F545fAE52B2",
    wxdai: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
    xdaiBridge: "0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d",
    xdaiBridge2: "0x7301CFA0e1756B71869E93d4e4Dca5c7d0eb0AA6",
    hopDaiWrapper: "0x6C928f435d1F3329bABb42d69CCF043e3900EcF1",
  },
  arbitrumOne: {
    aaveV3: {
      poolV3: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
      wrappedTokenGatewayV3: "0x5760E34c4003752329bC77790B1De44C2799F8C3",
      aArbWeth: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
      variableDebtWeth: "0x0c84331e39d6658Cd6e6b9ba04736cC4c4734351",
      protocolDataProviderV3: "0x14496b405D62c24F91f04Cda1c69Dc526D56fDE5",
    },
    aura: {
      booster: "0x98Ef32edd24e2c92525E59afc4475C1242a30184",
      rewardPoolDepositWrapper: "0x6b02fEFd2F2e06f51E17b7d5b8B20D75fd6916be",
      rewarder: "0x40bF10900a55c69c9dADdc3dC52465e01AcEF4A4",
    },
    balancerV2: {
      vault: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
      gauge: "0x260cbb867359a1084eC97de4157d06ca74e89415",
      bpt: "0x9791d590788598535278552EEcD4b211bFc790CB",
      minter: "0xc3ccacE87f6d3A81724075ADcb5ddd85a8A1bB68",
      relayer: "0x9B892E515D2Ab8869F17488d64B3b918731cc70d",
      relayerLibrary: "0x4b7b369989e613ff2C65768B7Cf930cC927F901E",
    },
    circleV1: {
      tokenMessenger: "0x19330d10D9Cc8751218eaf51E8885D058642E08A",
      messageTransmitter: "0xC30362313FBBA5cf9163F0bb16a0e01f01A896ca",
    },
    compoundV3: {
      cUsdcV3: "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf",
      cometRewards: "0x88730d254A2f7e6AC8388c3198aFd694bA9f7fae",
    },
    cowSwap: {
      orderSigner: "0x23dA9AdE38E4477b23770DeD512fD37b12381FAB",
    },
    uniswapV3: {
      positionsNft: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
    },
    weth: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    usdc: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    gatewayRouter: "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933",
    l2HopCctp: "0x6504BFcaB789c35325cA4329f1f41FaC340bf982",
    hopDaiWrapper: "0xe7F40BF16AB09f4a6906Ac2CAA4094aD2dA48Cc2",
  },
  optimism: {
    aaveV3: {
      poolV3: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
      wrappedTokenGatewayV3: "0x60eE8b61a13c67d0191c851BEC8F0bc850160710",
      aOptWeth: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
      variableDebtWeth: "0x0c84331e39d6658Cd6e6b9ba04736cC4c4734351",
      protocolDataProviderV3: "0x14496b405D62c24F91f04Cda1c69Dc526D56fDE5",
    },
    aura: {
      booster: "0x98Ef32edd24e2c92525E59afc4475C1242a30184",
      rewardPoolDepositWrapper: "0x51b6e0ac6D6435650748513C71db453F96749fe1",
      rewarder: "0xe350DFC963445F3B64a4229d019787491a58F8B9",
    },
    balancerV2: {
      vault: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
      gauge: "0xA30992B40a0cb4B2Da081ddBd843f9CcE25c2fe3",
      bpt: "0x7B50775383d3D6f0215A8F290f2C9e2eEBBEceb2",
      minter: "0x4fb47126Fa83A8734991E41B942Ac29A3266C968",
      relayer: "0x015ACA20a1422F3c729086c17f15F10e0CfbC75A",
      relayerLibrary: "0xA69E0Ccf150a29369D8Bbc0B3f510849dB7E8EEE",
    },
    circleV1: {
      tokenMessenger: "0x2B4069517957735bE00ceE0fadAE88a26365528f",
      messageTransmitter: "0x4D41f22c5a0e5c74090899E5a8Fb597a8842b3e8",
    },
    compoundV3: {
      cUsdcV3: "0x2e44e174f7D53F0212823acC11C01A11d58c5bCB",
      cometRewards: "0x443EA0340cb75a160F31A440722dec7b5bc3C2E9",
    },
    uniswapV3: {
      positionsNft: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
    },
    weth: "0x4200000000000000000000000000000000000006",
    usdc: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
    daiTokenBridge: "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65",
    optimismBridge: "0x4200000000000000000000000000000000000010",
    l2HopCctp: "0x469147af8Bde580232BE9DC84Bb4EC84d348De24",
    hopDaiWrapper: "0xb3C68a491608952Cb1257FC9909a537a0173b63B",
  },
  base: {
    aaveV3: {
      poolV3: "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5",
      wrappedTokenGatewayV3: "0x729b3EA8C005AbC58c9150fb57Ec161296F06766",
      aBasWeth: "0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7",
      variableDebtWeth: "0x24e6e0795b3c7c71D965fCc4f371803d1c1DcA1E",
      protocolDataProviderV3: "0xC4Fcf9893072d61Cc2899C0054877Cb752587981",
    },
    aura: {
      booster: "0x98Ef32edd24e2c92525E59afc4475C1242a30184",
      rewardPoolDepositWrapper: "0xa9952C914D86f896c53Bf17125c4104Cc058008E",
      rewarder: "0xcCAC11368BDD522fc4DD23F98897712391ab1E00",
    },
    balancerV2: {
      vault: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
      gauge: "0x8D118063B521e0CB9947A934BE90f7e32d02b158",
      bpt: "0xC771c1a5905420DAEc317b154EB13e4198BA97D0",
      minter: "0x0c5538098EBe88175078972F514C9e101D325D4F",
      relayer: "0x7C3C773C878d2238a9b64d8CEE02377BF07ED06a",
      relayerLibrary: "0x82416Ce6eA7dD4923d4A3ED70a79B4A432a382C4",
    },
    circleV1: {
      tokenMessenger: "0x1682Ae6375C4E4A97e4B583BC394c861A46D8962",
      messageTransmitter: "0xAD09780d193884d503182aD4588450C416D6F9D4",
    },
    compoundV3: {
      cUsdcV3: "0xb125E6687d4313864e53df431d5425969c15Eb2F",
      cometRewards: "0x123964802e6ABabBE1Bc9547D72Ef1B69B00A6b1",
    },
    morpho: {
      morphoBlue: "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb",
    },
    weth: "0x4200000000000000000000000000000000000006",
    uniswapV3: {
      positionsNft: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
    },
    usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    l2HopCctp: "0xe7F40BF16AB09f4a6906Ac2CAA4094aD2dA48Cc2",
  },
} as const satisfies EthSdkConfig["contracts"]

export default defineConfig({
  rpc: {
    mainnet: "https://ethereum-rpc.publicnode.com",
    gnosis: "https://rpc.gnosischain.com/",
    optimism: "https://optimism-rpc.publicnode.com",
    arbitrumOne: "https://arb1.arbitrum.io/rpc",
    base: "https://base-rpc.publicnode.com",
  },
  contracts,
})
