import { NotFoundError } from "../../errors"
import ilks from "./_info"
import { Ilk } from "./types"
import { deposit, borrow } from "./actions"

const queryProxy = async (avatar: string) => {
  return "0x123" as `0x${string}`
}

const queryIlk = async (cdp: string) => {
  const ilkDescription = ""
  const ilk = ilks.find((ilk) => ilk.ilkDescription === ilkDescription)
  if (!ilk) {
    throw new NotFoundError(`No Ilk found with description: ${ilkDescription}`)
  }
  return ilk
}

export const eth = {
  deposit: async ({
    targets,
    avatar,
  }: {
    /** vault/cdp IDs */
    targets?: string[]
    avatar: string
  }) => {
    // query proxy address for avatar
    const proxy = await queryProxy(avatar)

    // query the gem address for each target
    // const ilks = await Promise.all(targets.map(queryIlk))

    // compile set of tokens (multiple gems might use the same token)
    // const tokens = [...new Set(gems.map((gem) => gem.address))]

    const cdps = (await queryAllCdpIds(proxy)) as string[]
    let finalTargets = targets || cdps

    return (
      await Promise.all(
        finalTargets.map(async (cdp) => {
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
    // query proxy address for avatar
    const proxy = await queryProxy(avatar)
    const cdps = await queryAllCdpIds(proxy)

    let finalTargets = targets || cdps
    finalTargets.forEach((cdp) => {
      if (!cdps.includes(cdp))
        throw new NotFoundError(`No CDP found with ID: ${cdp}`)
    })

    return finalTargets.flatMap((cdp) => borrow({ proxy, cdp }))
  },
}
