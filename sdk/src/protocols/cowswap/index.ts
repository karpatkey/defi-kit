import { allow } from "zodiac-roles-sdk/kit"
import { oneOf } from "../../conditions"

const swap = async (options: {
  sell?: `0x${string}`[]
  buy?: `0x${string}`[]
}) => {
  const { sell, buy } = options
  if (sell && sell.length === 0) {
    throw new Error(
      "`sell` must not be an empty array. Pass `undefined` if you want to allow selling any token."
    )
  }
  if (buy && buy.length === 0) {
    throw new Error(
      "`buy` must not be an empty array. Pass `undefined` if you want to allow buying any token."
    )
  }
  return [
    allow.mainnet.cowswap.orderSigner.signOrder(
      sell || buy
        ? ({
            sellToken: sell && oneOf(sell),
            buyToken: buy && oneOf(buy),
          } as any) // StructScoping requires at least one field scoping to be defined. We make sure of that, but TS doesn't know that. So we cast to `any` to make TS happy.
        : undefined,
      undefined,
      undefined,
      { delegatecall: true }
    ),
  ]
}

export const eth = {
  swap,
}

export const gno = {
  swap,
}
