import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve, oneOf } from "../../conditions"
import { c, Permission } from "zodiac-roles-sdk"
import { contracts } from "../../../eth-sdk/config"
import { BigNumberish } from "ethers"

const GPv2VaultRelayer = "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110"
const E_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

const swap = async (options: {
  sell: (`0x${string}` | "ETH")[]
  buy?: (`0x${string}` | "ETH")[]
  fee_amount_bp?: number
}) => {
  const { sell, buy, fee_amount_bp } = options
  const permissions: Permission[] = []

  if (sell.length === 0) {
    throw new Error("`sell` must not be an empty array.")
  }
  if (buy && buy.length === 0) {
    throw new Error(
      "`buy` must not be an empty array. Pass `undefined` if you want to allow buying any token."
    )
  }
  if (fee_amount_bp !== undefined) {
    if (
      !Number.isInteger(fee_amount_bp) ||
      fee_amount_bp < 0 ||
      fee_amount_bp > 10000
    ) {
      throw new Error("`fee_amount_bp` must be an integer between 0 and 10000.")
    }
  }

  if ("ETH" in sell) {
    permissions.push(allow.mainnet.weth.deposit({ send: true }))
  }

  const updatedSell = sell.map((item) =>
    item === "ETH" ? contracts.mainnet.weth : item
  )
  const updatedBuy =
    buy && buy.map((item) => (item === "ETH" ? E_ADDRESS : item))

  const orderStructScoping = {
    sellToken: oneOf(updatedSell),
    buyToken: updatedBuy && oneOf(updatedBuy),
    receiver: c.avatar,
  }

  permissions.push(
    ...allowErc20Approve(updatedSell as `0x${string}`[], [GPv2VaultRelayer]),

    allow.mainnet.cowswap.orderSigner.signOrder(
      orderStructScoping,
      undefined,
      fee_amount_bp !== undefined
        ? c.lte(fee_amount_bp as BigNumberish)
        : undefined,
      { delegatecall: true }
    ),

    allow.mainnet.cowswap.orderSigner.unsignOrder(orderStructScoping, {
      delegatecall: true,
    })
  )

  return permissions
}

export const eth = {
  swap,
}

export const gno = {
  swap,
}
