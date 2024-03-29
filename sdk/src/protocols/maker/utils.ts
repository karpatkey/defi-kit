import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { BigNumber } from "ethers"
import { NotFoundError } from "../../errors"
import ilks from "./_info"
import { Ilk } from "./types"
import { ethProvider } from "../../provider"
import { getProvider } from "../../../test/provider"

const sdk = getMainnetSdk(
  process.env.NODE_ENV === "test" ? getProvider() : ethProvider
)

export const queryProxy = async (avatar: `0x${string}`) => {
  return (await sdk.maker.ProxyRegistry.proxies(avatar)) as `0x${string}`
}

export const queryCdps = async (proxy: `0x${string}`, targets?: string[]) => {
  // fetch all cdps
  const cdps: BigNumber[] = []
  let cdp = await sdk.maker.CdpManager.first(proxy)
  console.log({ first: cdp, proxy })
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

export const queryIlk = async (cdp: BigNumber) => {
  const ilkId = await sdk.maker.CdpManager.ilks(cdp)
  const ilk = ilks.find((ilk) => ilk.ilk === ilkId)
  if (!ilk) {
    throw new Error(`Unexpected ilk ${ilkId} of cdp ${cdp.toNumber()}`)
  }
  return ilk
}
