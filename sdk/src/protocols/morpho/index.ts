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

const findBluePool = (marketIdAddress: string) => {
  const pools = _ethBluePools
  const marketIdLower = marketIdAddress.toLowerCase()
  const pool = pools.find(
    (pool) => pool.marketId.toLowerCase() === marketIdLower
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
            pool.address,
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
    blueTargets: EthBluePool["marketId"][]
  }) => {
    return blueTargets.flatMap((blueTarget) => {
      const pool = findBluePool(blueTarget)
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
        //- Step1: supplyCollateral**
        {
          ...allow.mainnet.morpho.morphoBlue.supplyCollateral(
            undefined, //marketParams
            undefined, //asset
            c.avatar, //onBehalf
            "0x"
          ),
        },
        //Step2: borrow
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
        //Step3: withdraw
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

        //Step4: withdrawCollateral
        {
          ...allow.mainnet.morpho.morphoBlue.withdrawCollateral(
            undefined, //morphoBluePoolTest,
            undefined,
            c.avatar,
            c.avatar
          ),
        }
      )
      return permissions
    })
  },
}
