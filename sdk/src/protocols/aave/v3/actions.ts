import { allow } from "zodiac-roles-sdk/kit"
import { Permission, c } from "zodiac-roles-sdk"
import ethTokens from "./_ethInfo"
import gnoTokens from "./_gnoInfo"
import arb1Tokens from "./_arb1Info"
import { Token } from "./types"
import { allowErc20Approve } from "../../../conditions"
import { contracts, contractAddressOverrides } from "../../../../eth-sdk/config"
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
      }

    case Chain.gno:
      return {
        aNativeToken: contractAddressOverrides.gnosis.aaveV3
          .aGnoWXDAI as `0x${string}`,
        wrappedTokenGatewayV3: contractAddressOverrides.gnosis.aaveV3
          .wrappedTokenGatewayV3 as `0x${string}`,
        aaveLendingPoolV3: contractAddressOverrides.gnosis.aaveV3
          .aaveLendingPoolV3 as `0x${string}`,
        wrappedNativeToken: contractAddressOverrides.gnosis
          .wxdai as `0x${string}`,
        variableDebtWrappedNativeToken: contractAddressOverrides.gnosis.aaveV3
          .variableDebtWXDAI as `0x${string}`,
      }

    case Chain.arb1:
      return {
        aNativeToken: contractAddressOverrides.arbitrumOne.aaveV3
          .aArbWETH as `0x${string}`,
        wrappedTokenGatewayV3: contractAddressOverrides.arbitrumOne.aaveV3
          .wrappedTokenGatewayV3 as `0x${string}`,
        aaveLendingPoolV3: contractAddressOverrides.arbitrumOne.aaveV3
          .aaveLendingPoolV3 as `0x${string}`,
        wrappedNativeToken: contractAddressOverrides.arbitrumOne
          .weth as `0x${string}`,
        variableDebtWrappedNativeToken: contractAddressOverrides.arbitrumOne
          .aaveV3.variableDebtWETH as `0x${string}`,
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
  const { aaveLendingPoolV3 } = _getAllAddresses(chain)

  const permissions: Permission[] = [
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
      ...allow.mainnet.aaveV3.aaveLendingPoolV3[
        "withdraw(address,uint256,address)"
      ](token.token, undefined, c.avatar),
      targetAddress: aaveLendingPoolV3,
    },
    {
      ...allow.mainnet.aaveV3.aaveLendingPoolV3.setUserUseReserveAsCollateral(
        token.token
      ),
      targetAddress: aaveLendingPoolV3,
    },
  ]

  if (chain === Chain.arb1) {
    const assetId = _getAssetId(chain, token)

    permissions.push({
      ...allow.mainnet.aaveV3.aaveLendingPoolV3["withdraw(bytes32)"](
        // Skip amount 30 bytes
        // Set assetId
        c.bitmask({
          shift: 30,
          mask: "0xffff",
          value: assetId,
        })
      ),
      targetAddress: aaveLendingPoolV3,
    })
  }

  return permissions
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
  ]
}

export const borrowEther = (chain: Chain) => {
  const {
    wrappedTokenGatewayV3,
    aaveLendingPoolV3,
    variableDebtWrappedNativeToken,
  } = _getAllAddresses(chain)

  return [
    {
      ...allow.mainnet.aaveV3.variableDebtWETH.approveDelegation(
        wrappedTokenGatewayV3
      ),
      targetAddress: variableDebtWrappedNativeToken,
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
  ]
}
