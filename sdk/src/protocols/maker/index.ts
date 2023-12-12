import { NotFoundError } from "../../errors"
import gems from "./_info"
import { Gem } from "./types"
import { deposit, borrow } from "./actions"

const queryGem = async (cdp: string) => {
  const ilkDescription = await queryIlkOfCdp(cdp)
  const gem = gems.find((gem) => gem.ilkDescription === ilkDescription)
  if (!gem) {
    throw new NotFoundError(`No Gem found with Ilk: ${ilkDescription}`)
  }
  return gem
}

export const eth = {
  deposit: async ({
    targets,
    avatar,
  }: {
    /** vault/cdp IDs */
    targets: string[]
    avatar: string
  }) => {
    // query proxy address for avatar
    const proxy = await queryProxy(avatar)

    // query the gem address for each target
    const gems = await Promise.all(targets.map(queryGem))

    // compile set of tokens (multiple gems might use the same token)
    const gemTokens = [...new Set(gems.map((gem) => gem.address))]

    return await Promise.all(
      targets.flatMap(async (cdp) => {
        const gem = await queryGem(cdp)
        deposit({ proxy, cdp, gem })
      })
    )
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

    let finalTargets = targets || (await queryAllCdpIds(proxy))

    return finalTargets.flatMap((cdp) => borrow({ proxy, cdp }))
  },
}
