import { allow } from "zodiac-roles-sdk/kit"
import { Permission, PermissionSet, c } from "zodiac-roles-sdk"
import { allowErc20Approve } from "../../../conditions"
import { Chain } from "../../../../src"
import gnoTokens from "../../../protocols/aave/v3/_gnoCoreInfo"
import arb1Tokens from "../../../protocols/aave/v3/_arb1CoreInfo"
import oethTokens from "../../../protocols/aave/v3/_oethCoreInfo"
import baseTokens from "../../../protocols/aave/v3/_baseCoreInfo"
import { EthMarket, Token } from "../../../protocols/aave/v3/types"
import {
  findMarket,
  getEthMarketTokens,
  findToken,
} from "../../../protocols/aave/v3"
import {
  _getAllAddresses,
  _getAssetId,
} from "../../../protocols/aave/v3/actions"

const getSelectedMarketAndTokens = (
  chain: Chain,
  market: EthMarket["name"] | EthMarket["poolAddress"]
) => {
  if (chain === Chain.eth) {
    const selectedMarket = findMarket(market)
    return { selectedMarket, tokens: getEthMarketTokens(selectedMarket.name) }
  }

  const tokens =
    chain === Chain.gno
      ? gnoTokens
      : chain === Chain.arb1
      ? arb1Tokens
      : chain === Chain.oeth
      ? oethTokens
      : chain === Chain.base
      ? baseTokens
      : undefined

  if (!tokens) {
    throw new Error(`Unsupported chain: ${chain}`)
  }

  return { selectedMarket: undefined, tokens }
}

const getValidatedMarketAddresses = (chain: Chain, market: string) => {
  if (market === "EtherFi") {
    throw new Error("EtherFi market does not support ETH.")
  }

  const addresses = _getAllAddresses(chain, market)
  if (!addresses?.wrappedTokenGatewayV3) {
    throw new Error(
      `wrappedTokenGatewayV3 is not defined for market: ${market}`
    )
  }

  return addresses
}

const depositEther = (chain: Chain, market: string = "Core") => {
  const { wrappedTokenGatewayV3, poolV3 } = getValidatedMarketAddresses(
    chain,
    market
  )

  return [
    {
      ...allow.mainnet.aaveV3.wrappedTokenGatewayCoreV3.depositETH(
        poolV3,
        c.avatar,
        undefined,
        { send: true }
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
  ]
}

export const withdrawEther = (chain: Chain, market: string = "Core") => {
  const { aNativeToken, wrappedTokenGatewayV3, poolV3 } =
    getValidatedMarketAddresses(chain, market)

  return [
    ...allowErc20Approve([aNativeToken], [wrappedTokenGatewayV3]),
    {
      ...allow.mainnet.aaveV3.wrappedTokenGatewayCoreV3.withdrawETH(
        poolV3,
        undefined,
        c.avatar
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
  ]
}

const setCollateralisationEther = (
  chain: Chain,
  useAsCollateral: boolean,
  market: string = "Core"
) => {
  const { poolV3, wrappedNativeToken } = getValidatedMarketAddresses(
    chain,
    market
  )

  return [
    {
      ...allow.mainnet.aaveV3.poolCoreV3.setUserUseReserveAsCollateral(
        wrappedNativeToken,
        useAsCollateral
      ),
      targetAddress: poolV3,
    },
  ]
}

const depositToken = (chain: Chain, token: Token, market: string = "Core") => {
  const { poolV3 } = _getAllAddresses(chain, market)

  return [
    ...allowErc20Approve([token.token], [poolV3]),
    {
      ...allow.mainnet.aaveV3.poolCoreV3.supply(
        token.token,
        undefined,
        c.avatar
      ),
      targetAddress: poolV3,
    },
  ]
}

export const withdrawToken = (
  chain: Chain,
  token: Token,
  market: string = "Core"
) => {
  const { poolV3 } = _getAllAddresses(chain, market)

  const permissions: Permission[] = [
    {
      ...allow.mainnet.aaveV3.poolCoreV3.withdraw(
        token.token,
        undefined,
        c.avatar
      ),
      targetAddress: poolV3,
    },
  ]

  if (chain === Chain.arb1 || chain === Chain.oeth) {
    const assetId = _getAssetId(chain, token)

    permissions.push({
      ...allow.arbitrumOne.aaveV3.poolV3["withdraw(bytes32)"](
        c.bitmask({
          shift: 30,
          mask: "0xffff",
          value: assetId,
        })
      ),
      targetAddress: poolV3,
    })
  }

  return permissions
}

const setCollateralisationToken = (
  chain: Chain,
  token: Token,
  useAsCollateral: boolean,
  market: string = "Core"
) => {
  const { poolV3 } = _getAllAddresses(chain, market)

  return [
    {
      ...allow.mainnet.aaveV3.poolCoreV3.setUserUseReserveAsCollateral(
        token.token,
        useAsCollateral
      ),
      targetAddress: poolV3,
    },
  ]
}

export const depositOptions = (
  chain: Chain,
  token: "ETH" | "XDAI" | Token["symbol"] | Token["token"],
  market: EthMarket["name"] | EthMarket["poolAddress"] = "Core"
): PermissionSet => {
  const { selectedMarket, tokens } = getSelectedMarketAndTokens(chain, market)

  return token === "ETH" || token === "XDAI"
    ? depositEther(chain, selectedMarket?.name || "Core")
    : depositToken(
        chain,
        findToken(tokens, token),
        selectedMarket?.name || "Core"
      )
}

export const withdrawOptions = (
  chain: Chain,
  token: "ETH" | "XDAI" | Token["symbol"] | Token["token"],
  market: EthMarket["name"] | EthMarket["poolAddress"] = "Core"
): PermissionSet => {
  const { selectedMarket, tokens } = getSelectedMarketAndTokens(chain, market)

  return token === "ETH" || token === "XDAI"
    ? withdrawEther(chain, selectedMarket?.name || "Core")
    : withdrawToken(
        chain,
        findToken(tokens, token),
        selectedMarket?.name || "Core"
      )
}

export const collateralisationOptions = (
  chain: Chain,
  token: "ETH" | "XDAI" | Token["symbol"] | Token["token"],
  useAsCollateral: boolean,
  market: EthMarket["name"] | EthMarket["poolAddress"] = "Core"
): PermissionSet => {
  const { selectedMarket, tokens } = getSelectedMarketAndTokens(chain, market)

  return token === "ETH" || token === "XDAI"
    ? setCollateralisationEther(
        chain,
        useAsCollateral,
        selectedMarket?.name || "Core"
      )
    : setCollateralisationToken(
        chain,
        findToken(tokens, token),
        useAsCollateral,
        selectedMarket?.name || "Core"
      )
}
