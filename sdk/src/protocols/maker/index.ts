import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { NotFoundError } from "../../errors"
import ilks from "./_info"
import { Ilk } from "./types"
import { deposit, borrow } from "./actions"
import { ethProvider } from "../../provider"
import { BigNumber } from "ethers"

const sdk = getMainnetSdk(ethProvider)

const queryProxy = async (avatar: string) => {
  return await sdk.maker.ProxyRegistry.proxies(avatar)
}

const queryCdps = async (proxy: string, targets?: string[]) => {
  // fetch all cdps
  const cdps: BigNumber[] = []
  let cdp = await sdk.maker.CdpManager.first(proxy)
  while (!cdp.isZero()) {
    cdps.push(cdp)
    cdp = (await sdk.maker.CdpManager.list(cdp)).next
  }

  const targetCdps = targets?.map((target) => {
    try {
      return BigNumber.from(target)
    } catch (e) {
      // could not be parsed as BigNumber
      throw new NotFoundError(`Cdp not found: ${target}`)
    }
  })
  targetCdps?.forEach((target) => {
    if (!cdps.some((cdp) => cdp.eq(target))) {
      throw new NotFoundError(`Cdp not found: ${target}`)
    }
  })

  return targetCdps || cdps
}

const queryIlk = async (cdp: BigNumber) => {
  const ilkId = await sdk.maker.CdpManager.ilks(cdp)
  const ilk = ilks.find((ilk) => ilk.ilk === ilkId)
  if (!ilk) {
    throw new Error(`Unexpected ilk ${ilkId} of cdp ${cdp.toNumber()}`)
  }
  return ilk
}

const queryAllCdpIds = async (proxy: string) => {}

export const eth = {
  deposit: async ({
    targets,
    avatar,
  }: {
    /** vault/cdp IDs */
    targets?: string[]
    avatar: string
  }) => {
    const proxy = await queryProxy(avatar)
    const cdps = await queryCdps(proxy, targets)

    return (
      await Promise.all(
        cdps.map(async (cdp) => {
          const ilk = await queryIlk(cdp)
          return deposit({ proxy, cdp, ilk })
        })
      )
    ).flat()
  },

  borrow: async ({
    targets,
    avatar,
  }: {
    /** vault/cdp IDs */
    targets?: string[]
    avatar: string
  }) => {
    const proxy = await queryProxy(avatar)
    const cdps = await queryCdps(proxy, targets)

    return cdps.flatMap((cdp) => borrow({ proxy, cdp }))
  },
}
