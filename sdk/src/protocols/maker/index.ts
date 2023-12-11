import { Address } from "@dethcrypto/eth-sdk"
import { NotFoundError } from "../../errors"
import gems from "./_info"
import { Gem, Cdp } from "./types"
import { deposit, borrow } from "./actions"

const findGem = (ilkDescription: string): Gem => {
  const gem = gems.find((gem) => gem.ilkDescription === ilkDescription)
  if (!gem) {
    throw new NotFoundError(`No Gem found with Ilk: ${ilkDescription}`)
  }
  return gem
}

export const eth = {
  deposit: ({ proxy, cdps }: { proxy: Address; cdps: Cdp[] }) => {
    return cdps.flatMap((cdp) =>
      deposit(proxy, cdp, findGem(cdp["ilkDescription"]))
    )
  },
  borrow: ({ proxy, cdps }: { proxy: Address; cdps: Cdp[] }) => {
    return cdps.flatMap((cdp) => borrow(proxy, cdp))
  },
}
