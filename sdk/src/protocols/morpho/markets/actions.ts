import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve } from "../../../conditions"
import { Permission } from "zodiac-roles-sdk"
import { Chain } from "../../../types"
import { Market } from "./types"
import { c } from "zodiac-roles-sdk"
import { contracts } from "../../../../eth-sdk/config"

const _getMorphoBlueAddress = (chain: Chain): `0x${string}` => {
  switch (chain) {
    case Chain.eth:
      return contracts.mainnet.morpho.morphoBlue as `0x${string}`
    case Chain.arb1:
      return contracts.arbitrumOne.morpho.morphoBlue as `0x${string}`
    case Chain.base:
      return contracts.base.morpho.morphoBlue as `0x${string}`
    default:
      throw new Error(`Morpho not supported on chain: ${chain}`)
  }
}

export const deposit = (chain: Chain, market: Market): Permission[] => {
  const morphoBlueAddress = _getMorphoBlueAddress(chain)

  return [
    // Approval for loan token
    ...allowErc20Approve([market.loanToken.address], [morphoBlueAddress]),

    // Supply permission
    {
      ...allow.mainnet.morpho.morphoBlue.supply(
        {
          loanToken: market.loanToken.address,
          collateralToken: market.collateralToken.address,
          oracle: market.oracle,
          irm: market.irm,
          lltv: market.lltv,
        },
        undefined,
        undefined,
        c.avatar,
        "0x"
      ),
      targetAddress: morphoBlueAddress,
    },

    // Withdraw permission
    {
      ...allow.mainnet.morpho.morphoBlue.withdraw(
        {
          loanToken: market.loanToken.address,
          collateralToken: market.collateralToken.address,
          oracle: market.oracle,
          irm: market.irm,
          lltv: market.lltv,
        },
        undefined,
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: morphoBlueAddress,
    },
  ]
}

export const borrow = (chain: Chain, market: Market): Permission[] => {
  const morphoBlueAddress = _getMorphoBlueAddress(chain)

  return [
    // Approvals for both tokens
    ...allowErc20Approve(
      [market.loanToken.address, market.collateralToken.address],
      [morphoBlueAddress]
    ),

    // Supply collateral permission
    {
      ...allow.mainnet.morpho.morphoBlue.supplyCollateral(
        {
          loanToken: market.loanToken.address,
          collateralToken: market.collateralToken.address,
          oracle: market.oracle,
          irm: market.irm,
          lltv: market.lltv,
        },
        undefined,
        c.avatar,
        "0x"
      ),
      targetAddress: morphoBlueAddress,
    },

    // Withdraw collateral permission
    {
      ...allow.mainnet.morpho.morphoBlue.withdrawCollateral(
        {
          loanToken: market.loanToken.address,
          collateralToken: market.collateralToken.address,
          oracle: market.oracle,
          irm: market.irm,
          lltv: market.lltv,
        },
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: morphoBlueAddress,
    },

    // Borrow permission
    {
      ...allow.mainnet.morpho.morphoBlue.borrow(
        {
          loanToken: market.loanToken.address,
          collateralToken: market.collateralToken.address,
          oracle: market.oracle,
          irm: market.irm,
          lltv: market.lltv,
        },
        undefined,
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: morphoBlueAddress,
    },

    // Repay permission
    {
      ...allow.mainnet.morpho.morphoBlue.repay(
        {
          loanToken: market.loanToken.address,
          collateralToken: market.collateralToken.address,
          oracle: market.oracle,
          irm: market.irm,
          lltv: market.lltv,
        },
        undefined,
        undefined,
        c.avatar,
        "0x"
      ),
      targetAddress: morphoBlueAddress,
    },
  ]
}
