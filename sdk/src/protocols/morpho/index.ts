import { allow } from "zodiac-roles-sdk/kit"
import { Permission } from "zodiac-roles-sdk/."
import { allowErc20Approve } from "../../conditions"
import { c } from "zodiac-roles-sdk"
import { contracts } from "../../../eth-sdk/config"
import { EthPool } from "./types"
import abi from "../../../eth-sdk/abis/mainnet/morpho/morphoBlue.json"
import { NotFoundError } from "../../errors"
import _ethPools from "./_ethPools"
import { Contract } from "ethers"
import { ethProvider } from "../../provider"

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

//take a marketId and look for it on chain to get the marketParams
const findBluePool = async (marketId: string) => {
  const morphoBlue = new Contract(contracts.mainnet.morpho.morphoBlue, abi, ethProvider)
  const marketParams = await morphoBlue.idToMarketParams(marketId)

  console.log("marketParams: ", marketParams)

  
  // Create pool object from on-chain data
  const pool = {
    collateralToken: marketParams.collateralToken,
    loanToken: marketParams.loanToken,
    lltv: marketParams.lltv.toString(),
    oracle: marketParams.oracle,
    irm: marketParams.irm,
    marketId: marketId
  };

  if (!pool) {
    throw new NotFoundError(`Pool not found for marketId: ${marketId}`);
  }
  
  return pool;
}


// {
//   collateralToken: "0x4c9EDD5852cd905f086C759E8383e09bff1E68B3",
//   loanToken: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
//   lltv: "770000000000000000",
//   oracle: "0xaE4750d0813B5E37A51f7629beedd72AF1f9cA35",
//   irm: "0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC",
//   marketId:
//     "0xfd8493f09eb6203615221378d89f53fcd92ff4f7d62cca87eece9a2fff59e86f",
// },
// const findBluePool = (marketIdAddress: string) => {
//   // const pools = _ethBluePools
//   const marketIdLower = marketIdAddress.toLowerCase()
//   const pool = pools.find(
//     (pool) => pool.marketId.toLowerCase() === marketIdLower
//   )
//   if (!pool) {
//     throw new NotFoundError(`Pool not found: ${marketIdAddress}`)
//   }
//   return pool
// }

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
          ...allow.mainnet.weth.approve(pool.address, undefined),
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
    blueTargets: string[]
  }) => {
    const promises = await Promise.all(blueTargets.map(async (blueTarget) => { 
      const pool = await findBluePool(blueTarget)
      const permissions: Permission[] = []

      permissions.push(
        // *** Morpho Blue *** //
        ...allowErc20Approve([pool.loanToken], [pool.collateralToken]),
        {
          ...allow.mainnet.weth.approve(
            contracts.mainnet.morpho.morphoBlue,
            undefined
          ),
          targetAddress: pool.collateralToken,
        },
        {
          ...allow.mainnet.lido.wstEth.approve(
            contracts.mainnet.morpho.morphoBlue,
            undefined
          ),
          targetAddress: pool.loanToken,
        },
        {
          ...allow.mainnet.morpho.morphoBlue.supplyCollateral(
            undefined,
            undefined,
            c.avatar,
            "0x"
          ),
        },
        {
          ...allow.mainnet.morpho.morphoBlue.borrow(
            {
              loanToken: pool.loanToken,
              collateralToken: pool.collateralToken,
              oracle: pool.oracle,
              irm: pool.irm,
              lltv: pool.lltv,
            },
            undefined,
            undefined,
            c.avatar,
            c.avatar
          ),
        },
        {
          ...allow.mainnet.morpho.morphoBlue.repay(
            {
              loanToken: pool.loanToken,
              collateralToken: pool.collateralToken,
              oracle: pool.oracle,
              irm: pool.irm,
              lltv: pool.lltv,
            },
            undefined,
            undefined,
            c.avatar,
            "0x"
          ),
        },
        {
          ...allow.mainnet.morpho.morphoBlue.withdrawCollateral(
            undefined,
            undefined,
            c.avatar,
            c.avatar
          ),
        }
      )
      return permissions
    }))
    return promises.flatMap(p => p)
  },
}
