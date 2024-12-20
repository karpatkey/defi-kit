import { allow } from "zodiac-roles-sdk/kit"
import { Permission, c } from "zodiac-roles-sdk"
import ethTokens from "./_ethCoreInfo"
import gnoTokens from "./_gnoCoreInfo"
import arb1Tokens from "./_arb1CoreInfo"
import oethTokens from "./_oethCoreInfo"
import baseTokens from "./_baseCoreInfo"
import { Token } from "./types"
import { allowErc20Approve } from "../../../conditions"
import { contracts } from "../../../../eth-sdk/config"
import { Chain } from "../../../types"

export const _getAllAddresses = (chain: Chain) => {
  switch (chain) {
    case Chain.eth:
      return {
        aNativeToken: contracts.mainnet.aaveV3.aEthWeth as `0x${string}`,
        wrappedTokenGatewayV3: contracts.mainnet.aaveV3
          .wrappedTokenGatewayV3 as `0x${string}`,
        lendingPoolV3: contracts.mainnet.aaveV3.lendingPoolV3 as `0x${string}`,
        wrappedNativeToken: contracts.mainnet.weth as `0x${string}`,
        variableDebtWrappedNativeToken: contracts.mainnet.aaveV3
          .variableDebtWeth as `0x${string}`,
      }

    case Chain.gno:
      return {
        aNativeToken: contracts.gnosis.aaveV3.aGnoWXDAI as `0x${string}`,
        wrappedTokenGatewayV3: contracts.gnosis.aaveV3
          .wrappedTokenGatewayV3 as `0x${string}`,
        lendingPoolV3: contracts.gnosis.aaveV3.lendingPoolV3 as `0x${string}`,
        wrappedNativeToken: contracts.gnosis.wxdai as `0x${string}`,
        variableDebtWrappedNativeToken: contracts.gnosis.aaveV3
          .variableDebtWXDAI as `0x${string}`,
      }

    case Chain.arb1:
      return {
        aNativeToken: contracts.arbitrumOne.aaveV3.aArbWeth as `0x${string}`,
        wrappedTokenGatewayV3: contracts.arbitrumOne.aaveV3
          .wrappedTokenGatewayV3 as `0x${string}`,
        lendingPoolV3: contracts.arbitrumOne.aaveV3
          .lendingPoolV3 as `0x${string}`,
        wrappedNativeToken: contracts.arbitrumOne.weth as `0x${string}`,
        variableDebtWrappedNativeToken: contracts.arbitrumOne.aaveV3
          .variableDebtWeth as `0x${string}`,
      }

    case Chain.oeth:
      return {
        aNativeToken: contracts.optimism.aaveV3.aOptWeth as `0x${string}`,
        wrappedTokenGatewayV3: contracts.optimism.aaveV3
          .wrappedTokenGatewayV3 as `0x${string}`,
        lendingPoolV3: contracts.optimism.aaveV3.lendingPoolV3 as `0x${string}`,
        wrappedNativeToken: contracts.optimism.weth as `0x${string}`,
        variableDebtWrappedNativeToken: contracts.optimism.aaveV3
          .variableDebtWeth as `0x${string}`,
      }

    case Chain.base:
      return {
        aNativeToken: contracts.base.aaveV3.aBasWeth as `0x${string}`,
        wrappedTokenGatewayV3: contracts.base.aaveV3
          .wrappedTokenGatewayV3 as `0x${string}`,
        lendingPoolV3: contracts.base.aaveV3.lendingPoolV3 as `0x${string}`,
        wrappedNativeToken: contracts.base.weth as `0x${string}`,
        variableDebtWrappedNativeToken: contracts.base.aaveV3
          .variableDebtWeth as `0x${string}`,
      }

    default:
      throw new Error(`Unsupported chain: ${chain}`)
  }
}

// Function to get the 2-byte hexadecimal representation of the assetId
const _getAssetId = (chain: Chain, token: Token): string => {
  // Select the appropriate token list based on the chain
  let tokens
  switch (chain) {
    case Chain.eth:
      tokens = ethTokens
      break
    case Chain.gno:
      tokens = gnoTokens
      break
    case Chain.arb1:
      tokens = arb1Tokens
      break
    case Chain.oeth:
      tokens = oethTokens
      break
    case Chain.base:
      tokens = baseTokens
      break
    default:
      throw new Error(`Unsupported chain: ${chain}`)
  }

  // Find the index of the token in the list
  const index = tokens.findIndex((t) => t.token === token.token)
  if (index === -1) {
    throw new Error(`Token not found in the ${chain} token list.`)
  }

  // Convert the index to a 2-byte hexadecimal string, padded with leading zeros
  const hexIndex = index.toString(16).padStart(4, "0")
  return `0x${hexIndex}`
}

export const depositToken = (chain: Chain, token: Token) => {
  const { lendingPoolV3 } = _getAllAddresses(chain)

  const permissions: Permission[] = [
    ...allowErc20Approve([token.token], [lendingPoolV3]),
    {
      ...allow.mainnet.aaveV3.lendingPoolV3.supply(
        token.token,
        undefined,
        c.avatar
      ),
      targetAddress: lendingPoolV3,
    },
    {
      ...allow.mainnet.aaveV3.lendingPoolV3.withdraw(
        token.token,
        undefined,
        c.avatar
      ),
      targetAddress: lendingPoolV3,
    },
    {
      ...allow.mainnet.aaveV3.lendingPoolV3.setUserUseReserveAsCollateral(
        token.token
      ),
      targetAddress: lendingPoolV3,
    },
  ]

  if (chain === Chain.arb1 || chain === Chain.oeth) {
    const assetId = _getAssetId(chain, token)

    permissions.push({
      ...allow.arbitrumOne.aaveV3.lendingPoolV3["withdraw(bytes32)"](
        // Skip amount 30 bytes
        // Set assetId
        c.bitmask({
          shift: 30,
          mask: "0xffff",
          value: assetId,
        })
      ),
      targetAddress: lendingPoolV3,
    })
  }

  return permissions
}

export const depositEther = (chain: Chain) => {
  const {
    aNativeToken,
    wrappedTokenGatewayV3,
    lendingPoolV3,
    wrappedNativeToken,
  } = _getAllAddresses(chain)

  return [
    ...allowErc20Approve([aNativeToken], [wrappedTokenGatewayV3]),
    {
      ...allow.mainnet.aaveV3.wrappedTokenGatewayV3.depositETH(
        lendingPoolV3,
        c.avatar,
        undefined,
        { send: true }
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
    {
      ...allow.mainnet.aaveV3.wrappedTokenGatewayV3.withdrawETH(
        lendingPoolV3,
        undefined,
        c.avatar
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
    {
      ...allow.mainnet.aaveV3.lendingPoolV3.setUserUseReserveAsCollateral(
        wrappedNativeToken
      ),
      targetAddress: lendingPoolV3,
    },
  ]
}

export const borrowToken = (chain: Chain, token: Token) => {
  const { lendingPoolV3 } = _getAllAddresses(chain)

  return [
    ...allowErc20Approve([token.token], [lendingPoolV3]),
    {
      ...allow.mainnet.aaveV3.lendingPoolV3.borrow(
        token.token,
        undefined,
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: lendingPoolV3,
    },
    {
      ...allow.mainnet.aaveV3.lendingPoolV3.repay(
        token.token,
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: lendingPoolV3,
    },
  ]
}

export const borrowEther = (chain: Chain) => {
  const {
    wrappedTokenGatewayV3,
    lendingPoolV3,
    variableDebtWrappedNativeToken,
  } = _getAllAddresses(chain)

  return [
    {
      ...allow.mainnet.aaveV3.variableDebtWeth.approveDelegation(
        wrappedTokenGatewayV3
      ),
      targetAddress: variableDebtWrappedNativeToken,
    },
    {
      ...allow.mainnet.aaveV3.wrappedTokenGatewayV3.borrowETH(lendingPoolV3),
      targetAddress: wrappedTokenGatewayV3,
    },
    {
      ...allow.mainnet.aaveV3.wrappedTokenGatewayV3.repayETH(
        lendingPoolV3,
        undefined,
        c.avatar,
        { send: true }
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
  ]
}
