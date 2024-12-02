import { allow } from "zodiac-roles-sdk/kit"
import { Permission, c } from "zodiac-roles-sdk"
import { Ilk } from "./types"
import { allowErc20Approve } from "../../conditions"
import { contracts } from "../../../eth-sdk/config"

export const deposit = ({
  proxy,
  cdp,
  ilk,
}: {
  proxy: `0x${string}`
  cdp: bigint
  ilk: Ilk
}): Permission[] => {
  const permissions: Permission[] = [
    ...allowErc20Approve([ilk.address], [proxy]),
    // lockGem
    {
      ...allow.mainnet.maker.dsProxy["execute(address,bytes)"](
        contracts.mainnet.maker.proxyActions,
        c.calldataMatches(
          allow.mainnet.maker.proxyActions.lockGem(
            contracts.mainnet.maker.cdpManager,
            ilk.gemJoin,
            cdp
          )
        )
      ),
      targetAddress: proxy,
      send: true,
    },
    // freeGem
    {
      ...allow.mainnet.maker.dsProxy["execute(address,bytes)"](
        contracts.mainnet.maker.proxyActions,
        c.calldataMatches(
          allow.mainnet.maker.proxyActions.freeGem(
            contracts.mainnet.maker.cdpManager,
            ilk.gemJoin,
            cdp
          )
        )
      ),
      targetAddress: proxy,
      send: true,
    },
  ]

  // if the ilk is WETH, we also allow ETH
  if (ilk.symbol === "WETH") {
    permissions.push(
      // lockETH
      {
        ...allow.mainnet.maker.dsProxy["execute(address,bytes)"](
          contracts.mainnet.maker.proxyActions,
          c.calldataMatches(
            allow.mainnet.maker.proxyActions.lockETH(
              contracts.mainnet.maker.cdpManager,
              ilk.gemJoin,
              cdp
            )
          )
        ),
        targetAddress: proxy,
        send: true,
      },
      // freeETH
      {
        ...allow.mainnet.maker.dsProxy["execute(address,bytes)"](
          contracts.mainnet.maker.proxyActions,
          c.calldataMatches(
            allow.mainnet.maker.proxyActions.freeETH(
              contracts.mainnet.maker.cdpManager,
              ilk.gemJoin,
              cdp
            )
          )
        ),
        targetAddress: proxy,
        send: true,
      }
    )
  }

  return permissions
}

export const borrow = ({
  proxy,
  cdp,
}: {
  proxy: `0x${string}`
  cdp: bigint
}): Permission[] => {
  return [
    // Draw
    {
      ...allow.mainnet.maker.dsProxy["execute(address,bytes)"](
        contracts.mainnet.maker.proxyActions,
        c.calldataMatches(
          allow.mainnet.maker.proxyActions.draw(
            contracts.mainnet.maker.cdpManager,
            contracts.mainnet.maker.jug,
            contracts.mainnet.maker.daiJoin,
            cdp
          )
        )
      ),
      targetAddress: proxy,
      send: true,
    },
    // Wipe
    {
      ...allow.mainnet.maker.dsProxy["execute(address,bytes)"](
        contracts.mainnet.maker.proxyActions,
        c.calldataMatches(
          allow.mainnet.maker.proxyActions.wipe(
            contracts.mainnet.maker.cdpManager,
            contracts.mainnet.maker.daiJoin,
            cdp
          )
        )
      ),
      targetAddress: proxy,
      send: true,
    },
  ]
}
