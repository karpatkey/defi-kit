import { allow } from "zodiac-roles-sdk/kit"
import { Permission, c } from "zodiac-roles-sdk"
import { Gem, Cdp } from "./types"
import { allowErc20Approve } from "../../erc20"
import { Address } from "@dethcrypto/eth-sdk"
import { contracts } from "../../../eth-sdk/config"

export const deposit = (proxy: Address, cdp: Cdp, gem: Gem): Permission[] => {
  const permissions: Permission[] = [
    ...allowErc20Approve([gem.address], [proxy]),
    // lockGem
    {
      ...allow.mainnet.maker.DsProxy["execute(address,bytes)"](
        contracts.mainnet.maker.ProxyActions,
        c.calldataMatches(
          allow.mainnet.maker.ProxyActions.lockGem(
            contracts.mainnet.maker.CdpManager,
            gem.gemJoin,
            cdp.id
          )
        )
      ),
      targetAddress: proxy,
    },
    // freeGem
    {
      ...allow.mainnet.maker.DsProxy["execute(address,bytes)"](
        contracts.mainnet.maker.ProxyActions,
        c.calldataMatches(
          allow.mainnet.maker.ProxyActions.freeGem(
            contracts.mainnet.maker.CdpManager,
            gem.gemJoin,
            cdp.id
          )
        )
      ),
      targetAddress: proxy,
    },
  ]

  // if the gem is WETH, we also allow ETH
  if (gem.symbol === "WETH") {
    permissions.push(
      // lockETH
      {
        ...allow.mainnet.maker.DsProxy["execute(address,bytes)"](
          contracts.mainnet.maker.ProxyActions,
          c.calldataMatches(
            allow.mainnet.maker.ProxyActions.lockETH(
              contracts.mainnet.maker.CdpManager,
              gem.gemJoin,
              cdp.id,
              {
                send: true,
              }
            )
          )
        ),
        targetAddress: proxy,
      },
      // freeETH
      {
        ...allow.mainnet.maker.DsProxy["execute(address,bytes)"](
          contracts.mainnet.maker.ProxyActions,
          c.calldataMatches(
            allow.mainnet.maker.ProxyActions.freeETH(
              contracts.mainnet.maker.CdpManager,
              gem.gemJoin,
              cdp.id
            )
          )
        ),
        targetAddress: proxy,
      }
    )
  }

  return permissions
}

export const borrow = (proxy: Address, cdp: Cdp): Permission[] => {
  return [
    // Draw
    {
      ...allow.mainnet.maker.DsProxy["execute(address,bytes)"](
        contracts.mainnet.maker.ProxyActions,
        c.calldataMatches(
          allow.mainnet.maker.ProxyActions.draw(
            contracts.mainnet.maker.CdpManager,
            contracts.mainnet.maker.Jug,
            contracts.mainnet.maker.DaiJoin,
            cdp.id
          )
        )
      ),
      targetAddress: proxy,
    },
    // Wipe
    {
      ...allow.mainnet.maker.DsProxy["execute(address,bytes)"](
        contracts.mainnet.maker.ProxyActions,
        c.calldataMatches(
          allow.mainnet.maker.ProxyActions.wipe(
            contracts.mainnet.maker.CdpManager,
            contracts.mainnet.maker.DaiJoin,
            cdp.id
          )
        )
      ),
      targetAddress: proxy,
    },
  ]
}
