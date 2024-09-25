import { allow } from "zodiac-roles-sdk/kit"
import { c, Permission } from "zodiac-roles-sdk"
import { Token } from "./types"
import { allowErc20Approve } from "../../conditions"
import { contracts, contractAddressOverrides } from "../../../eth-sdk/config"
import { Chain } from "../../types"

export const _getAllAddresses = (chain: Chain) => {
  switch (chain) {
    case Chain.eth:
      return {
        spNativeToken: contracts.mainnet.spark.spWETH as `0x${string}`,
        wrappedTokenGatewayV3: contracts.mainnet.spark
          .wrappedTokenGatewayV3 as `0x${string}`,
        sparkLendingPoolV3: contracts.mainnet.spark
          .sparkLendingPoolV3 as `0x${string}`,
        wrappedNativeToken: contracts.mainnet.weth as `0x${string}`,
        variableDebtWrappedNativeToken: contracts.mainnet.spark
          .variableDebtWETH as `0x${string}`,
        stableDebtWrappedNativeToken: contracts.mainnet.spark
          .stableDebtWETH as `0x${string}`,
        RewardsController: contracts.mainnet.spark
          .RewardsController as `0x${string}`,
      }

    case Chain.gno:
      return {
        spNativeToken: contractAddressOverrides.gnosis.spark
          .spWXDAI as `0x${string}`,
        wrappedTokenGatewayV3: contractAddressOverrides.gnosis.spark
          .wrappedTokenGatewayV3 as `0x${string}`,
        sparkLendingPoolV3: contractAddressOverrides.gnosis.spark
          .sparkLendingPoolV3 as `0x${string}`,
        wrappedNativeToken: contractAddressOverrides.gnosis
          .wxdai as `0x${string}`,
        variableDebtWrappedNativeToken: contractAddressOverrides.gnosis.spark
          .variableDebtWXDAI as `0x${string}`,
        RewardsController: contractAddressOverrides.gnosis.spark
          .RewardsController as `0x${string}`,
      }

    default:
      throw new Error(`Unsupported chain: ${chain}`)
  }
}

export const depositDsr = (chain: Chain): Permission[] => {
  switch (chain) {
    case Chain.eth:
      return [
        ...allowErc20Approve(
          [contracts.mainnet.dai],
          [contracts.mainnet.spark.sDAI]
        ),
        allow.mainnet.spark.sDAI.deposit(undefined, c.avatar),
        allow.mainnet.spark.sDAI.redeem(undefined, c.avatar, c.avatar),
        // Spark's new UI now calls the withdraw() function instead of redeem()
        allow.mainnet.spark.sDAI.withdraw(undefined, c.avatar, c.avatar),
      ]

    case Chain.gno:
      return [
        ...allowErc20Approve(
          [contractAddressOverrides.gnosis.spark.sDAI],
          [contracts.gnosis.spark.SavingsXDaiAdapter]
        ),
        // Using XDAI
        allow.gnosis.spark.SavingsXDaiAdapter.depositXDAI(c.avatar, {
          send: true,
        }),
        allow.gnosis.spark.SavingsXDaiAdapter.redeemXDAI(undefined, c.avatar),
        // Using WXDAI
        ...allowErc20Approve(
          [contractAddressOverrides.gnosis.wxdai],
          [contracts.gnosis.spark.SavingsXDaiAdapter]
        ),
        allow.gnosis.spark.SavingsXDaiAdapter.deposit(undefined, c.avatar),
        allow.gnosis.spark.SavingsXDaiAdapter.redeem(undefined, c.avatar),
      ]

    default:
      // Handle unsupported chains
      throw new Error(`Unsupported chain: ${chain}`)
  }
}

export const depositToken = (chain: Chain, token: Token) => {
  const { sparkLendingPoolV3, RewardsController } = _getAllAddresses(chain)

  return [
    ...allowErc20Approve([token.token], [sparkLendingPoolV3]),
    {
      ...allow.mainnet.spark.sparkLendingPoolV3.supply(
        token.token,
        undefined,
        c.avatar
      ),
      targetAddress: sparkLendingPoolV3,
    },
    {
      ...allow.mainnet.spark.sparkLendingPoolV3.withdraw(
        token.token,
        undefined,
        c.avatar
      ),
      targetAddress: sparkLendingPoolV3,
    },
    {
      ...allow.mainnet.spark.sparkLendingPoolV3.setUserUseReserveAsCollateral(
        token.token
      ),
      targetAddress: sparkLendingPoolV3,
    },
    {
      ...allow.mainnet.spark.RewardsController.claimRewards(
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: RewardsController,
    },
    {
      ...allow.mainnet.spark.RewardsController.claimAllRewards(
        undefined,
        c.avatar
      ),
      targetAddress: RewardsController,
    },
  ]
}

export const depositEther = (chain: Chain) => {
  const {
    spNativeToken,
    wrappedTokenGatewayV3,
    sparkLendingPoolV3,
    wrappedNativeToken,
    RewardsController,
  } = _getAllAddresses(chain)

  return [
    ...allowErc20Approve([spNativeToken], [wrappedTokenGatewayV3]),
    {
      ...allow.mainnet.spark.wrappedTokenGatewayV3.depositETH(
        sparkLendingPoolV3,
        c.avatar,
        undefined,
        { send: true }
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
    {
      ...allow.mainnet.spark.wrappedTokenGatewayV3.withdrawETH(
        sparkLendingPoolV3,
        undefined,
        c.avatar
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
    {
      ...allow.mainnet.spark.sparkLendingPoolV3.setUserUseReserveAsCollateral(
        wrappedNativeToken
      ),
      targetAddress: sparkLendingPoolV3,
    },
    {
      ...allow.mainnet.spark.RewardsController.claimRewards(
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: RewardsController,
    },
    {
      ...allow.mainnet.spark.RewardsController.claimAllRewards(
        undefined,
        c.avatar
      ),
      targetAddress: RewardsController,
    },
  ]
}

export const borrowToken = (chain: Chain, token: Token) => {
  const { sparkLendingPoolV3 } = _getAllAddresses(chain)

  return [
    ...allowErc20Approve([token.token], [sparkLendingPoolV3]),
    {
      ...allow.mainnet.spark.sparkLendingPoolV3.borrow(
        token.token,
        undefined,
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: sparkLendingPoolV3,
    },
    {
      ...allow.mainnet.spark.sparkLendingPoolV3.repay(
        token.token,
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: sparkLendingPoolV3,
    },
    // Spark has only made available the borrow action with interestRateModel = 2 (Variable Debt)
    // allow.mainnet.spark.sparkLendingPoolV3.swapBorrowRateMode(token.token),
  ]
}

export const borrowEther = (chain: Chain) => {
  const {
    wrappedTokenGatewayV3,
    sparkLendingPoolV3,
    variableDebtWrappedNativeToken,
    stableDebtWrappedNativeToken,
  } = _getAllAddresses(chain)

  return [
    {
      ...allow.mainnet.spark.variableDebtWETH.approveDelegation(
        wrappedTokenGatewayV3
      ),
      targetAddress: variableDebtWrappedNativeToken,
    },
    // Spark has only made available the borrow action with interestRateModel = 2 (Variable Debt)
    // stableDebtWrappedNativeToken is not defined in all chains
    ...(stableDebtWrappedNativeToken
      ? [
          {
            ...allow.mainnet.spark.stableDebtWETH.approveDelegation(
              wrappedTokenGatewayV3
            ),
            targetAddress: stableDebtWrappedNativeToken,
          },
        ]
      : []),
    {
      ...allow.mainnet.spark.wrappedTokenGatewayV3.borrowETH(
        sparkLendingPoolV3
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
    {
      ...allow.mainnet.spark.wrappedTokenGatewayV3.repayETH(
        sparkLendingPoolV3,
        undefined,
        undefined,
        c.avatar,
        { send: true }
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
    // Spark has only made available the borrow action with interestRateModel = 2 (Variable Debt)
    // allow.mainnet.spark.sparkLendingPoolV3.swapBorrowRateMode(WETH),
  ]
}
