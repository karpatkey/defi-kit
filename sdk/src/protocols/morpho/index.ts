import { allow } from "zodiac-roles-sdk/kit"
import { Permission } from "zodiac-roles-sdk/."
import { allowErc20Approve } from "../../conditions"
import { c } from "zodiac-roles-sdk"
import { contracts } from "../../../eth-sdk/config"
import { EthPool } from "./types"
import { EthBluePool } from "./types"
import { NotFoundError } from "../../errors"
import _ethPools from "./_ethPools"
import _ethBluePools from "./_ethBluePools"
import { isAddress } from "ethers"

const METAMORPHO_VAULT = "0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658" // Replace with the actual vault address
// const ETHEREUM_BUNDLER = "0x4095F064B8d3c3548A3bebfd0Bbfd04750E30077" // EthereumBundlerV2
const morphoBluePoolTest = [
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", //loanToken
  "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0", //collateralToken
  "0xbD60A6770b27E084E8617335ddE769241B0e71D8", //oracle
  "0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC", //irm
  "965000000000000000" //lltv
]
//0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,
// 0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0,
// 0xbD60A6770b27E084E8617335ddE769241B0e71D8,
// 0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC

// const asset: ""

const findPool = (nameOrAddress: string) => {
  const pools = _ethPools
  const nameOrAddressLower = nameOrAddress.toLowerCase()
  const pool = pools.find(
    (pool) =>
      pool.name.toLowerCase() === nameOrAddressLower ||
      pool.address.toLowerCase() === nameOrAddressLower ||
      pool.symbol.toLowerCase() === nameOrAddressLower
  )
  if (!pool) {
    throw new NotFoundError(`Pool not found: ${nameOrAddress}`)
  }
  return pool
}
//bytes32
const findBluePool = (marketIdAddress: string) => {
  const pools = _ethBluePools
  const marketIdLower = marketIdAddress.toLowerCase()
  const pool = pools.find(
    (pool) =>
      pool.marketId.toLowerCase() === marketIdLower
  )
  if (!pool) {
    throw new NotFoundError(`Pool not found: ${marketIdAddress}`)
  }
  return pool
}

export const eth = {
  deposit: async ({
    targets,
  }: {
    targets: (EthPool["symbol"] | EthPool["address"])[]
  }) => {
    return targets.flatMap((target) => {
      const pool = findPool(target)
      const permissions: Permission[] = []

      permissions.push(
        // *** metaMorpho *** //
        {
          ...allow.mainnet.weth.approve(
            pool.address, //gtLRTcore vault
            undefined
          ),
          targetAddress: pool.asset.address,
        },
        {
          ...allow.mainnet.morpho.metaMorpho.deposit(undefined, c.avatar),
          targetAddress: pool.address,
        },
        {
          ...allow.mainnet.morpho.metaMorpho.mint(undefined, c.avatar),
          targetAddress: pool.address,
        },
        {
          ...allow.mainnet.morpho.metaMorpho.withdraw(
            undefined,
            c.avatar,
            c.avatar
          ),
          targetAddress: pool.address,
        },
        {
          ...allow.mainnet.morpho.metaMorpho.redeem(
            undefined,
            c.avatar,
            c.avatar
          ),
          targetAddress: pool.address,
        }
      )
      return permissions
    })
  },
  borrow: async ({
    blueTargets,
  }: {
    blueTargets: (EthBluePool["marketId"])[]
  }) => {
    return blueTargets.flatMap((blueTarget) => {
      const pool = findBluePool(blueTarget)
      const permissions: Permission[] = []

      permissions.push(
        // *** Morpho Blue *** //

        //Step0: appove: wstETH 0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0
        //amount : 0.0 -> spender: 0x4095F064B8d3c3548A3bebfd0Bbfd04750E30077
        //-> amount: 238442112376260655301

        //Step0: appove: wstETH 0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0
        //amount : 0.0 -> spender: 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb
        //-> amount: 238442112376260655301

        //- Step1: supplyCollateral**
        //   loanToken: pool.asset.address,
        //   collateralToken: pool.address,
        //   oracle: contracts.mainnet.oracle.address,
        //   irm: contracts.mainnet.interestRateModel.address,
        //   lltv: pool.lltv,
        //  0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,
        // 0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0,
        // 0xbD60A6770b27E084E8617335ddE769241B0e71D8,
        // 0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC
        // },
        // asset: pool.asset.address,
        // onBehalf: c.avatar, 0x0EFcCBb9E2C09Ea29551879bd9Da32362b32fc89
        {
          ...allow.mainnet.morpho.morphoBlue.supplyCollateral(
            //marketParams:
            undefined,//morphoBluePoolTest,
            // [
            //   undefined, // -> loanToken
            //   undefined, // -> collateralToken
            //   undefined, //irm
            //   undefined, //-> lltv
            // ],
            undefined, //asset
            c.avatar, //onBehalf
            "0x",
          ),
          targetAddress: pool.marketId,//TO CHANGE WITH NEW MORPHO BLUE POOL
        },

        //Step 1.1: reallocateTo
        //contract: publicAllocator 0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D
        //vault: 0x2371e134e3455e0593363cBF89d3b6cf53740618 //(gtWETH) Gauntlet WETH Prime
        //withdrawls [tuple]:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,
        // 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599,
        // 0xc29B3Bc033640baE31ca53F8a0Eb892AdF68e663,
        // 0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC
        //supplyMarketParams: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,
        // 0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0,
        // 0xbD60A6770b27E084E8617335ddE769241B0e71D8,
        // 0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC
        {
          ...allow.mainnet.morpho.publicAllocator.reallocateTo(
          ),
          targetAddress: pool.marketId,//TO CHANGE WITH NEW MORPHO BLUE POOL
        },

        //Step2: borrow
        //contract: morpho 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb
        //marketParams:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0,0xbD60A6770b27E084E8617335ddE769241B0e71D8,0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC

        //   loanToken: pool.asset.address,
        //   collateralToken: pool.address,
        //   oracle: contracts.mainnet.oracle.address,
        //   irm: contracts.mainnet.interestRateModel.address,
        //   lltv: pool.lltv,
        // },
        // asset: 25944520971279508434
        // onBehalf: c.avatar, 0x0EFcCBb9E2C09Ea29551879bd9Da32362b32fc89
        // - receiver (address) 0x0EFcCBb9E2C09Ea29551879bd9Da32362b32fc89
        // **Results:**
        // _0: The amount of assets borrowed.
        // _1: The amount of shares minted.

        {
          ...allow.mainnet.morpho.morphoBlue.borrow(
            undefined,//morphoBluePoolTest,
            undefined,
            undefined,
            c.avatar,
            c.avatar,
          ),
          targetAddress: pool.marketId, //TO CHANGE WITH NEW MORPHO BLUE POOL
        },

        //Step3: withdraw
        //marketParams:
        //   loanToken: pool.asset.address,
        //   collateralToken: pool.address,
        //   oracle: contracts.mainnet.oracle.address,
        //   irm: contracts.mainnet.interestRateModel.address,
        //   lltv: pool.lltv,
        // },
        // asset: pool.asset.address,
        // onBehalf: c.avatar,
        // - receiver (address)
        // - data (optional)?
        // **Results:**
        // _0: The amount of assets withdrawn.
        // _1: The amount of shares burned.
        {
          ...allow.mainnet.morpho.morphoBlue.withdraw(
            //marketParams:
            undefined,//morphoBluePoolTest,
            undefined,
            // [
            //   undefined, // -> loanToken
            //   undefined, // -> collateralToken
            //   undefined, //irm
            //   undefined, //-> lltv
            // ],
            undefined, //asset
            c.avatar, //onBehalf
            c.avatar,
            // "0x",
          ),
          targetAddress: pool.marketId,//TO CHANGE WITH NEW MORPHO BLUE POOL
        },

        //Step4: withdrawCollateral
        //marketParams:
        //   loanToken: pool.asset.address,
        //   collateralToken: pool.address,
        //   oracle: contracts.mainnet.oracle.address,
        //   irm: contracts.mainnet.interestRateModel.address,
        //   lltv: pool.lltv,
        // },
        // asset: pool.asset.address,
        // onBehalf: c.avatar,
        // - receiver (address)
        {
          ...allow.mainnet.morpho.morphoBlue.withdrawCollateral(
            undefined,//morphoBluePoolTest,
            undefined,
            c.avatar,
            c.avatar,
          ),
          targetAddress: pool.marketId, //TO CHANGE WITH NEW MORPHO BLUE POOL
        },
      )
      return permissions
    })
  },
}
