import { allow } from "zodiac-roles-sdk/kit"
import { PermissionSet, c } from "zodiac-roles-sdk"
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
import { _getAllAddresses } from "../../../protocols/aave/v3/actions"

const depositEther = (chain: Chain, market: string = "Core") => {
  if (market === "EtherFi") {
    throw new Error("EtherFi market does not support ETH deposits.")
  }

  const addresses = _getAllAddresses(chain, market)
  if (!addresses?.wrappedTokenGatewayV3) {
    throw new Error(`wrappedTokenGatewayV3 is not defined for market: ${market}`)
  }

  const { aNativeToken, wrappedTokenGatewayV3, poolV3 } = addresses

  return [
    ...allowErc20Approve([aNativeToken], [wrappedTokenGatewayV3]),
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

const depositToken = (chain: Chain, token: Token, market: string = "Core") => {
  const { poolV3 } = _getAllAddresses(chain, market)

  return [
    ...allowErc20Approve([token.token], [poolV3]),
    {
      ...allow.mainnet.aaveV3.poolCoreV3.supply(token.token, undefined, c.avatar),
      targetAddress: poolV3,
    },
  ]
}

export const depositOptions = (
  chain: Chain,
  token: "ETH" | "XDAI" | Token["symbol"] | Token["token"],
  market: EthMarket["name"] | EthMarket["poolAddress"] = "Core"
): PermissionSet => {
  let selectedMarket = chain === Chain.eth ? findMarket(market) : undefined

  const tokens =
    chain === Chain.eth ? getEthMarketTokens(selectedMarket!.name) :
    chain === Chain.gno ? gnoTokens :
    chain === Chain.arb1 ? arb1Tokens :
    chain === Chain.oeth ? oethTokens :
    chain === Chain.base ? baseTokens :
    undefined

  if (!tokens) {
    throw new Error(`Unsupported chain: ${chain}`)
  }

  return token === "ETH" || token === "XDAI"
    ? depositEther(chain, selectedMarket?.name || "Core")
    : depositToken(chain, findToken(tokens, token), selectedMarket?.name || "Core")
}
