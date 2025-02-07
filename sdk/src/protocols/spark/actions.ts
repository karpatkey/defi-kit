import { allow } from "zodiac-roles-sdk/kit"
import { c, Permission } from "zodiac-roles-sdk"
import { Token } from "./types"
import { allowErc20Approve } from "../../conditions"
import { contracts } from "../../../eth-sdk/config"
import { Chain } from "../../types"

export const _getAllAddresses = (chain: Chain) => {
  switch (chain) {
    case Chain.eth:
      return {
        spNativeToken: contracts.mainnet.spark.spWeth as `0x${string}`,
        wrappedTokenGatewayV3: contracts.mainnet.spark
          .wrappedTokenGatewayV3 as `0x${string}`,
        poolV3: contracts.mainnet.spark.poolV3 as `0x${string}`,
        wrappedNativeToken: contracts.mainnet.weth as `0x${string}`,
        variableDebtWrappedNativeToken: contracts.mainnet.spark
          .variableDebtWeth as `0x${string}`,
        stableDebtWrappedNativeToken: contracts.mainnet.spark
          .stableDebtWeth as `0x${string}`,
        rewardsController: contracts.mainnet.spark
          .rewardsController as `0x${string}`,
      }

    case Chain.gno:
      return {
        spNativeToken: contracts.gnosis.spark.spWxdai as `0x${string}`,
        wrappedTokenGatewayV3: contracts.gnosis.spark
          .wrappedTokenGatewayV3 as `0x${string}`,
        poolV3: contracts.gnosis.spark.poolV3 as `0x${string}`,
        wrappedNativeToken: contracts.gnosis.wxdai as `0x${string}`,
        variableDebtWrappedNativeToken: contracts.gnosis.spark
          .variableDebtWxdai as `0x${string}`,
        rewardsController: contracts.gnosis.spark
          .rewardsController as `0x${string}`,
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
          [contracts.mainnet.spark.sDai]
        ),
        allow.mainnet.spark.sDai.deposit(undefined, c.avatar),
        allow.mainnet.spark.sDai.redeem(undefined, c.avatar, c.avatar),
        // Spark's new UI now calls the withdraw() function instead of redeem()
        allow.mainnet.spark.sDai.withdraw(undefined, c.avatar, c.avatar),
      ]

    case Chain.gno:
      return [
        ...allowErc20Approve(
          [contracts.gnosis.spark.sDai],
          [contracts.gnosis.spark.savingsXdaiAdapter]
        ),
        // Using XDAI
        allow.gnosis.spark.savingsXdaiAdapter.depositXDAI(c.avatar, {
          send: true,
        }),
        allow.gnosis.spark.savingsXdaiAdapter.redeemXDAI(undefined, c.avatar),
        // Using WXDAI
        ...allowErc20Approve(
          [contracts.gnosis.wxdai],
          [contracts.gnosis.spark.savingsXdaiAdapter]
        ),
        allow.gnosis.spark.savingsXdaiAdapter.deposit(undefined, c.avatar),
        allow.gnosis.spark.savingsXdaiAdapter.redeem(undefined, c.avatar),
      ]

    default:
      // Handle unsupported chains
      throw new Error(`Unsupported chain: ${chain}`)
  }
}

export const depositUSDS = (): Permission[] => {
  return [
    ...allowErc20Approve(
      [contracts.mainnet.dai],
      [contracts.mainnet.spark.migrationActions]
    ),
    allow.mainnet.spark.migrationActions.migrateDAIToUSDS(c.avatar),
    allow.mainnet.spark.migrationActions.migrateDAIToSUSDS(c.avatar),
    ...allowErc20Approve(
      [contracts.mainnet.spark.usds],
      [contracts.mainnet.spark.migrationActions]
    ),
    allow.mainnet.spark.migrationActions.downgradeUSDSToDAI(c.avatar),
    ...allowErc20Approve(
      [contracts.mainnet.spark.usds],
      [contracts.mainnet.spark.sUsds]
    ),
    allow.mainnet.spark.sUsds["deposit(uint256,address,uint16)"](
      undefined,
      c.avatar
    ),
    allow.mainnet.spark.sUsds.withdraw(undefined, c.avatar, c.avatar),
    allow.mainnet.spark.sUsds.redeem(undefined, c.avatar, c.avatar),
  ]
}

export const depositToken = (chain: Chain, token: Token) => {
  const { poolV3, rewardsController } = _getAllAddresses(chain)

  return [
    ...allowErc20Approve([token.token], [poolV3]),
    {
      ...allow.mainnet.spark.poolV3.supply(token.token, undefined, c.avatar),
      targetAddress: poolV3,
    },
    {
      ...allow.mainnet.spark.poolV3.withdraw(token.token, undefined, c.avatar),
      targetAddress: poolV3,
    },
    {
      ...allow.mainnet.spark.poolV3.setUserUseReserveAsCollateral(token.token),
      targetAddress: poolV3,
    },
    {
      ...allow.mainnet.spark.rewardsController.claimRewards(
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: rewardsController,
    },
    {
      ...allow.mainnet.spark.rewardsController.claimAllRewards(
        undefined,
        c.avatar
      ),
      targetAddress: rewardsController,
    },
  ]
}

export const depositEther = (chain: Chain) => {
  const {
    spNativeToken,
    wrappedTokenGatewayV3,
    poolV3,
    wrappedNativeToken,
    rewardsController,
  } = _getAllAddresses(chain)

  return [
    ...allowErc20Approve([spNativeToken], [wrappedTokenGatewayV3]),
    {
      ...allow.mainnet.spark.wrappedTokenGatewayV3.depositETH(
        poolV3,
        c.avatar,
        undefined,
        { send: true }
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
    {
      ...allow.mainnet.spark.wrappedTokenGatewayV3.withdrawETH(
        poolV3,
        undefined,
        c.avatar
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
    {
      ...allow.mainnet.spark.poolV3.setUserUseReserveAsCollateral(
        wrappedNativeToken
      ),
      targetAddress: poolV3,
    },
    {
      ...allow.mainnet.spark.rewardsController.claimRewards(
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: rewardsController,
    },
    {
      ...allow.mainnet.spark.rewardsController.claimAllRewards(
        undefined,
        c.avatar
      ),
      targetAddress: rewardsController,
    },
  ]
}

export const borrowToken = (chain: Chain, token: Token) => {
  const { poolV3 } = _getAllAddresses(chain)

  return [
    ...allowErc20Approve([token.token], [poolV3]),
    {
      ...allow.mainnet.spark.poolV3.borrow(
        token.token,
        undefined,
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: poolV3,
    },
    {
      ...allow.mainnet.spark.poolV3.repay(
        token.token,
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: poolV3,
    },
    // Spark has only made available the borrow action with interestRateModel = 2 (Variable Debt)
    // allow.mainnet.spark.poolV3.swapBorrowRateMode(token.token),
  ]
}

export const borrowEther = (chain: Chain) => {
  const {
    wrappedTokenGatewayV3,
    poolV3,
    variableDebtWrappedNativeToken,
    stableDebtWrappedNativeToken,
  } = _getAllAddresses(chain)

  return [
    {
      ...allow.mainnet.spark.variableDebtWeth.approveDelegation(
        wrappedTokenGatewayV3
      ),
      targetAddress: variableDebtWrappedNativeToken,
    },
    // Spark has only made available the borrow action with interestRateModel = 2 (Variable Debt)
    // stableDebtWrappedNativeToken is not defined in all chains
    ...(stableDebtWrappedNativeToken
      ? [
          {
            ...allow.mainnet.spark.stableDebtWeth.approveDelegation(
              wrappedTokenGatewayV3
            ),
            targetAddress: stableDebtWrappedNativeToken,
          },
        ]
      : []),
    {
      ...allow.mainnet.spark.wrappedTokenGatewayV3.borrowETH(poolV3),
      targetAddress: wrappedTokenGatewayV3,
    },
    {
      ...allow.mainnet.spark.wrappedTokenGatewayV3.repayETH(
        poolV3,
        undefined,
        undefined,
        c.avatar,
        { send: true }
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
    // Spark has only made available the borrow action with interestRateModel = 2 (Variable Debt)
    // allow.mainnet.spark.poolV3.swapBorrowRateMode(WETH),
  ]
}

export const stake = () => {
  return [
    ...allowErc20Approve(
      [contracts.mainnet.spark.usds],
      [contracts.mainnet.spark.stakingRewards]
    ),
    allow.mainnet.spark.stakingRewards["stake(uint256,uint16)"](),
    allow.mainnet.spark.stakingRewards.withdraw(),
    allow.mainnet.spark.stakingRewards.exit(),
    allow.mainnet.spark.stakingRewards.getReward(),
  ]
}
