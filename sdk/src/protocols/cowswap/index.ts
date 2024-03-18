import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve, oneOf } from "../../conditions"
import { c, Permission } from "zodiac-roles-sdk"

const GPv2VaultRelayer = "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110"
const E_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

const swap = async (options: {
  sell: (`0x${string}` | "ETH")[]
  buy?: (`0x${string}` | "ETH")[]
}) => {
  const { sell, buy } = options

  if (sell.length === 0) {
    throw new Error("`sell` must not be an empty array.")
  }
  if (buy && buy.length === 0) {
    throw new Error(
      "`buy` must not be an empty array. Pass `undefined` if you want to allow buying any token."
    )
  }

  const updatedSell = sell && sell.map(item => item === "ETH" ? E_ADDRESS : item)
  const updatedBuy = buy && buy.map(item => item === "ETH" ? E_ADDRESS : item)

  const orderStructScoping = {
    sellToken: oneOf(updatedSell),
    buyToken: updatedBuy && oneOf(updatedBuy),
    receiver: c.avatar
  }

  const permissions: Permission[] = [
    ...allowErc20Approve(updatedSell, [GPv2VaultRelayer]),

    allow.mainnet.cowswap.orderSigner.signOrder(
      orderStructScoping,
      undefined,
      undefined,
      { delegatecall: true }
    ),

    allow.mainnet.cowswap.orderSigner.unsignOrder(orderStructScoping, {
      delegatecall: true,
    }),
  ]

  if (E_ADDRESS in updatedSell) {
    permissions.push(
      allow.mainnet.weth.deposit(
        { send: true }
      )
    )
  }

  return permissions
}

export const eth = {
  swap,
}

export const gno = {
  swap,
}
