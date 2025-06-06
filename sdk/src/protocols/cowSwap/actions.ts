import { Chain } from "../../types"
import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve, oneOf } from "../../conditions"
import { c, Permission } from "zodiac-roles-sdk"
import { getWrappedNativeToken } from "./utils"

const gpV2VaultRelayer = "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110"
const eAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

export const swap = async (
  options: {
    sell: (`0x${string}` | "ETH" | "XDAI")[]
    buy?: (`0x${string}` | "ETH" | "XDAI")[]
    feeAmountBp?: number
  },
  chain: Chain
) => {
  const { sell, buy, feeAmountBp } = options
  const permissions: Permission[] = []

  if (sell.length === 0) {
    throw new Error("`sell` must not be an empty array.")
  }
  if (buy && buy.length === 0) {
    throw new Error(
      "`buy` must not be an empty array. Pass `undefined` if you want to allow buying any token."
    )
  }
  if (feeAmountBp !== undefined) {
    if (
      !Number.isInteger(feeAmountBp) ||
      feeAmountBp < 0 ||
      feeAmountBp > 10000
    ) {
      throw new Error("`feeAmountBp` must be an integer between 0 and 10000.")
    }
  }

  const wrappedNativeToken = getWrappedNativeToken(chain)

  if (sell.includes("ETH") || sell.includes("XDAI")) {
    permissions.push({
      ...allow.mainnet.weth.deposit({ send: true }),
      targetAddress: wrappedNativeToken,
    })
  }

  const updatedSell = sell.map((item) =>
    item === "ETH" || item === "XDAI" ? wrappedNativeToken : item
  )
  const updatedBuy =
    buy &&
    buy.map((item) => (item === "ETH" || item === "XDAI" ? eAddress : item))

  const orderStructScoping = {
    sellToken: oneOf(updatedSell),
    buyToken: updatedBuy && oneOf(updatedBuy),
    receiver: c.avatar,
  }

  permissions.push(
    ...allowErc20Approve(updatedSell as `0x${string}`[], [gpV2VaultRelayer]),

    allow.mainnet.cowSwap.orderSigner.signOrder(
      orderStructScoping,
      undefined,
      feeAmountBp !== undefined ? c.lte(feeAmountBp) : undefined,
      { delegatecall: true }
    ),

    allow.mainnet.cowSwap.orderSigner.unsignOrder(undefined, {
      delegatecall: true,
    })
  )

  return permissions
}
