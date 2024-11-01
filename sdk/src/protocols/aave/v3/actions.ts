import { allow } from "zodiac-roles-sdk/kit"
import { Permission, c } from "zodiac-roles-sdk"
import { Token } from "./types"
import { allowErc20Approve } from "../../../conditions"
import { contracts } from "../../../../eth-sdk/config"
import { Chain } from "../../../types"

export const _getAllAddresses = (chain: Chain) => {
  switch (chain) {
    case Chain.eth:
      return {
        aNativeToken: contracts.mainnet.aaveV3.aEthWETH as `0x${string}`,
        wrappedTokenGatewayV3: contracts.mainnet.aaveV3
          .wrappedTokenGatewayV3 as `0x${string}`,
        aaveLendingPoolV3: contracts.mainnet.aaveV3
          .aaveLendingPoolV3 as `0x${string}`,
        wrappedNativeToken: contracts.mainnet.weth as `0x${string}`,
        variableDebtWrappedNativeToken: contracts.mainnet.aaveV3
          .variableDebtWETH as `0x${string}`,
        stableDebtWrappedNativeToken: contracts.mainnet.aaveV3
          .stableDebtWETH as `0x${string}`,
      }

    case Chain.gno:
      return {
        aNativeToken: contracts.gnosis.aaveV3.aGnoWXDAI as `0x${string}`,
        wrappedTokenGatewayV3: contracts.gnosis.aaveV3
          .wrappedTokenGatewayV3 as `0x${string}`,
        aaveLendingPoolV3: contracts.gnosis.aaveV3
          .aaveLendingPoolV3 as `0x${string}`,
        wrappedNativeToken: contracts.gnosis.wxdai as `0x${string}`,
        variableDebtWrappedNativeToken: contracts.gnosis.aaveV3
          .variableDebtWXDAI as `0x${string}`,
        stableDebtWrappedNativeToken: contracts.gnosis.aaveV3
          .stableDebtWXDAI as `0x${string}`,
      }

    case Chain.arb1:
      return {
        aNativeToken: contracts.arbitrumOne.aaveV3.aArbWETH as `0x${string}`,
        wrappedTokenGatewayV3: contracts.arbitrumOne.aaveV3
          .wrappedTokenGatewayV3 as `0x${string}`,
        aaveLendingPoolV3: contracts.arbitrumOne.aaveV3
          .aaveLendingPoolV3 as `0x${string}`,
        wrappedNativeToken: contracts.arbitrumOne.weth as `0x${string}`,
        variableDebtWrappedNativeToken: contracts.arbitrumOne.aaveV3
          .variableDebtWETH as `0x${string}`,
        stableDebtWrappedNativeToken: contracts.arbitrumOne.aaveV3
          .stableDebtWETH as `0x${string}`,
      }

    default:
      throw new Error(`Unsupported chain: ${chain}`)
  }
}

export const depositToken = (chain: Chain, token: Token) => {
  const { aaveLendingPoolV3 } = _getAllAddresses(chain)

  return [
    ...allowErc20Approve([token.token], [aaveLendingPoolV3]),
    {
      ...allow.mainnet.aaveV3.aaveLendingPoolV3.supply(
        token.token,
        undefined,
        c.avatar
      ),
      targetAddress: aaveLendingPoolV3,
    },
    {
      ...allow.mainnet.aaveV3.aaveLendingPoolV3.withdraw(
        token.token,
        undefined,
        c.avatar
      ),
      targetAddress: aaveLendingPoolV3,
    },
    {
      ...allow.mainnet.aaveV3.aaveLendingPoolV3.setUserUseReserveAsCollateral(
        token.token
      ),
      targetAddress: aaveLendingPoolV3,
    },
  ]
}

export const depositEther = (chain: Chain) => {
  const {
    aNativeToken,
    wrappedTokenGatewayV3,
    aaveLendingPoolV3,
    wrappedNativeToken,
  } = _getAllAddresses(chain)

  return [
    ...allowErc20Approve([aNativeToken], [wrappedTokenGatewayV3]),
    {
      ...allow.mainnet.aaveV3.wrappedTokenGatewayV3.depositETH(
        aaveLendingPoolV3,
        c.avatar,
        undefined,
        { send: true }
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
    {
      ...allow.mainnet.aaveV3.wrappedTokenGatewayV3.withdrawETH(
        aaveLendingPoolV3,
        undefined,
        c.avatar
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
    {
      ...allow.mainnet.aaveV3.aaveLendingPoolV3.setUserUseReserveAsCollateral(
        wrappedNativeToken
      ),
      targetAddress: aaveLendingPoolV3,
    },
  ]
}

export const borrowToken = (chain: Chain, token: Token) => {
  const { aaveLendingPoolV3 } = _getAllAddresses(chain)

  return [
    ...allowErc20Approve([token.token], [aaveLendingPoolV3]),
    {
      ...allow.mainnet.aaveV3.aaveLendingPoolV3.borrow(
        token.token,
        undefined,
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: aaveLendingPoolV3,
    },
    {
      ...allow.mainnet.aaveV3.aaveLendingPoolV3.repay(
        token.token,
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: aaveLendingPoolV3,
    },
    {
      ...allow.mainnet.aaveV3.aaveLendingPoolV3.swapBorrowRateMode(token.token),
      targetAddress: aaveLendingPoolV3,
    },
  ]
}

export const borrowEther = (chain: Chain) => {
  const {
    wrappedTokenGatewayV3,
    aaveLendingPoolV3,
    wrappedNativeToken,
    variableDebtWrappedNativeToken,
    stableDebtWrappedNativeToken,
  } = _getAllAddresses(chain)

  return [
    {
      ...allow.mainnet.aaveV3.variableDebtWETH.approveDelegation(
        wrappedTokenGatewayV3
      ),
      targetAddress: variableDebtWrappedNativeToken,
    },
    {
      ...allow.mainnet.aaveV3.stableDebtWETH.approveDelegation(
        wrappedTokenGatewayV3
      ),
      targetAddress: stableDebtWrappedNativeToken,
    },
    {
      ...allow.mainnet.aaveV3.wrappedTokenGatewayV3.borrowETH(
        aaveLendingPoolV3
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
    {
      ...allow.mainnet.aaveV3.wrappedTokenGatewayV3.repayETH(
        aaveLendingPoolV3,
        undefined,
        c.avatar,
        { send: true }
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
    {
      ...allow.mainnet.aaveV3.aaveLendingPoolV3.swapBorrowRateMode(
        wrappedNativeToken
      ),
      targetAddress: aaveLendingPoolV3,
    },
  ]
}
