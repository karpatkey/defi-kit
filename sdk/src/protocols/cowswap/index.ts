import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve, oneOf } from "../../conditions"
import { c, Permission } from "zodiac-roles-sdk"
import { contractAddressOverrides, contracts } from "../../../eth-sdk/config"
import { Chain } from "../../types"

const GPv2VaultRelayer = "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110"
const E_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

const getWethAddress = (chain: Chain) => {
  switch (chain) {
    case Chain.eth:
      return contracts.mainnet.weth
    case Chain.gno:
      return contractAddressOverrides.gnosis.weth
    case Chain.arb1:
      return contractAddressOverrides.arbitrumOne.weth
  }
}

const getOrderSignerAddress = (chain: Chain) => {
  switch (chain) {
    case Chain.eth:
      return contracts.mainnet.cowswap.orderSigner
    case Chain.gno:
      return contracts.mainnet.cowswap.orderSigner
    case Chain.arb1:
      return contractAddressOverrides.arbitrumOne.cowswap.orderSigner
  }
}

const swap = async (
  options: {
    sell: (`0x${string}` | "ETH")[]
    buy?: (`0x${string}` | "ETH")[]
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

  const wethAddress = getWethAddress(chain)

  if ("ETH" in sell) {
    permissions.push({
      ...allow.mainnet.weth.deposit({ send: true }),
      targetAddress: wethAddress,
    })
  }

  const updatedSell = sell.map((item) => (item === "ETH" ? wethAddress : item))
  const updatedBuy =
    buy && buy.map((item) => (item === "ETH" ? E_ADDRESS : item))

  const orderStructScoping = {
    sellToken: oneOf(updatedSell),
    buyToken: updatedBuy && oneOf(updatedBuy),
    receiver: c.avatar,
  }

  const orderSigner = getOrderSignerAddress(chain)

  permissions.push(
    ...allowErc20Approve(updatedSell as `0x${string}`[], [GPv2VaultRelayer]),

    {
      ...allow.mainnet.cowswap.orderSigner.signOrder(
        orderStructScoping,
        undefined,
        feeAmountBp !== undefined ? c.lte(feeAmountBp) : undefined,
        { delegatecall: true }
      ),
      targetAddress: orderSigner,
    },

    {
      ...allow.mainnet.cowswap.orderSigner.unsignOrder(orderStructScoping, {
        delegatecall: true,
      }),
      targetAddress: orderSigner,
    }
  )

  return permissions
}

export const eth = {
  swap: (options: {
    sell: (`0x${string}` | "ETH")[]
    buy?: (`0x${string}` | "ETH")[]
    feeAmountBp?: number
  }) => swap(options, Chain.eth),
}

export const gno = {
  swap: (options: {
    sell: (`0x${string}` | "ETH")[]
    buy?: (`0x${string}` | "ETH")[]
    feeAmountBp?: number
  }) => swap(options, Chain.gno),
}

export const arb1 = {
  swap: (options: {
    sell: (`0x${string}` | "ETH")[]
    buy?: (`0x${string}` | "ETH")[]
    feeAmountBp?: number
  }) => swap(options, Chain.arb1),
}
