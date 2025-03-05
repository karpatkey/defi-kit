import { allow } from "zodiac-roles-sdk/kit"
import { Permission } from "zodiac-roles-sdk/."
import { allowErc20Approve } from "../../conditions"
import { c } from "zodiac-roles-sdk"
import { contracts } from "../../../eth-sdk/config"
import { EthPool } from "./types"
import abi from "../../../eth-sdk/abis/mainnet/morpho/morphoBlue.json"
import { NotFoundError } from "../../errors"
import _ethPools from "./_ethPools"
import { Contract, BigNumberish, AddressLike } from "ethers"
import { ethProvider } from "../../provider"
import { Address } from "@gnosis-guild/eth-sdk"

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

interface MarketParams {
  loanToken: Address
  collateralToken: Address
  oracle: Address
  irm: Address
  lltv: BigNumberish
}

const findBlueMarketParams = async (marketId: string) => {
  try {
    const morphoBlue = new Contract(
      contracts.mainnet.morpho.morphoBlue,
      abi,
      ethProvider
    )

    const marketParams: MarketParams | null = await morphoBlue.idToMarketParams(
      marketId
    )

    if (!marketParams) {
      throw new NotFoundError(
        `Market parameters not found for marketId: ${marketId}`
      )
    }

    return {
      collateralToken: marketParams.collateralToken,
      loanToken: marketParams.loanToken,
      lltv: marketParams.lltv.toString(),
      oracle: marketParams.oracle,
      irm: marketParams.irm,
    }
  } catch (error) {
    console.error(
      `Error fetching market parameters for marketId: ${marketId}`,
      error
    )
    throw new Error("Failed to retrieve market parameters")
  }
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
  borrow: async ({ blueTargets }: { blueTargets: string[] }) => {
    const promises = blueTargets.map(async (blueTarget) => {
      const pool = await findBlueMarketParams(blueTarget)

      if (c.matches(pool)) {
        const erc20Approvals = await allowErc20Approve(
          [pool.loanToken],
          [pool.collateralToken]
        )

        return [
          // *** Morpho Blue *** //
          ...erc20Approvals, // Now it's an actual array, not a promise
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
          ...(c.matches(pool)
            ? [
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
              ]
            : []),
          ...(c.matches(pool)
            ? [
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
              ]
            : []),
          ...(c.matches(pool)
            ? [
                {
                  ...allow.mainnet.morpho.morphoBlue.withdrawCollateral(
                    undefined,
                    undefined,
                    c.avatar,
                    c.avatar
                  ),
                },
              ]
            : []),
        ]
      }

      return []
    })

    return (await Promise.all(promises)).flat()
  },

  supply: async ({ supplyTargets }: { supplyTargets: string[] }) => {
    const promises = supplyTargets.map(async (supplyTarget) => {
      const pool = await findBlueMarketParams(supplyTarget)
      const paramsMarketHere = {
        collateralToken: pool.collateralToken,
        irm: pool.irm,
        lltv: pool.lltv,
        loanToken: pool.loanToken,
        oracle: pool.oracle,
      }
      return [
        // *** Monarch Lend *** //

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
          ...allow.mainnet.morpho.morphoBlue.supply(
            paramsMarketHere,
            undefined,
            undefined,
            c.avatar,
            "0x"
          ),
        },

        ...(c.matches(pool)
          ? [
              {
                ...allow.mainnet.morpho.morphoBlue.withdraw(
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
            ]
          : []),
      ]
    })
    return (await Promise.all(promises)).flat()
  },
}
