import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve, oneOf } from "../../conditions"

const GPv2VaultRelayer = "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110"

const swap = async (options: {
  sell: `0x${string}`[]
  buy?: `0x${string}`[]
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

  const orderStructScoping = {
    sellToken: oneOf(sell),
    buyToken: buy && oneOf(buy),
  }

  return [
    ...allowErc20Approve(sell, [GPv2VaultRelayer]),

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
}

export const eth = {
  swap,
}

export const gno = {
  swap,
}
