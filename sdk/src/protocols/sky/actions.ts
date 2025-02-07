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
      ...allow.mainnet.sky.dsProxy["execute(address,bytes)"](
        contracts.mainnet.sky.proxyActions,
        c.calldataMatches(
          allow.mainnet.sky.proxyActions.lockGem(
            contracts.mainnet.sky.cdpManager,
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
      ...allow.mainnet.sky.dsProxy["execute(address,bytes)"](
        contracts.mainnet.sky.proxyActions,
        c.calldataMatches(
          allow.mainnet.sky.proxyActions.freeGem(
            contracts.mainnet.sky.cdpManager,
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
        ...allow.mainnet.sky.dsProxy["execute(address,bytes)"](
          contracts.mainnet.sky.proxyActions,
          c.calldataMatches(
            allow.mainnet.sky.proxyActions.lockETH(
              contracts.mainnet.sky.cdpManager,
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
        ...allow.mainnet.sky.dsProxy["execute(address,bytes)"](
          contracts.mainnet.sky.proxyActions,
          c.calldataMatches(
            allow.mainnet.sky.proxyActions.freeETH(
              contracts.mainnet.sky.cdpManager,
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
      ...allow.mainnet.sky.dsProxy["execute(address,bytes)"](
        contracts.mainnet.sky.proxyActions,
        c.calldataMatches(
          allow.mainnet.sky.proxyActions.draw(
            contracts.mainnet.sky.cdpManager,
            contracts.mainnet.sky.jug,
            contracts.mainnet.sky.daiJoin,
            cdp
          )
        )
      ),
      targetAddress: proxy,
      send: true,
    },
    // Wipe
    {
      ...allow.mainnet.sky.dsProxy["execute(address,bytes)"](
        contracts.mainnet.sky.proxyActions,
        c.calldataMatches(
          allow.mainnet.sky.proxyActions.wipe(
            contracts.mainnet.sky.cdpManager,
            contracts.mainnet.sky.daiJoin,
            cdp
          )
        )
      ),
      targetAddress: proxy,
      send: true,
    },
  ]
}
