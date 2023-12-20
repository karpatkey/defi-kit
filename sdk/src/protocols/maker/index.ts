import { deposit, borrow } from "./actions"
import { queryCdps, queryIlk, queryProxy } from "./utils"

export const eth = {
  deposit: async ({
    targets,
    avatar,
  }: {
    /** vault/cdp IDs */
    targets?: string[]
    avatar: `0x${string}`
  }) => {
    const proxy = await queryProxy(avatar)
    console.log({ proxy })
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
    avatar: `0x${string}`
  }) => {
    const proxy = await queryProxy(avatar)
    const cdps = await queryCdps(proxy, targets)

    return cdps.flatMap((cdp) => borrow({ proxy, cdp }))
  },
}
