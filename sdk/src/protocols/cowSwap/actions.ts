import { Chain } from "../../types"
import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve, oneOf } from "../../conditions"
import { c, Permission } from "zodiac-roles-sdk"
import { getWrappedNativeToken } from "./utils"
import { contracts } from "../../../eth-sdk/config"

const gpV2VaultRelayer = "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110"
const eAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
const domainSeparator =
  "0xc078f884a2676e1345748b1feace7b0abee5d00ecadb6e574dcdd109a63e8943"
const TWAP = "0x6cF1e9cA41f7611dEf408122793c358a3d11E5a5"
const currentBlockTimestampFactory =
  "0x52eD56Da04309Aca4c3FECC595298d80C2f16BAc"

export const swap = async (
  options: {
    sell: (`0x${string}` | "ETH" | "XDAI")[]
    buy?: (`0x${string}` | "ETH" | "XDAI")[]
    feeAmountBp?: number
    twap?: boolean
    recipient?: `0x${string}`
  },
  chain: Chain
) => {
  const { sell, buy, feeAmountBp, twap = false, recipient } = options
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
  if (twap) {
    if (recipient === undefined) {
      throw new Error(
        "If `twap` is `true` then `recipient` must be a valid address."
      )
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
    ...allowErc20Approve(updatedSell as `0x${string}`[], [gpV2VaultRelayer])
  )

  if (twap) {
    permissions.push(
      {
        ...allow.mainnet.safe.gnosisSafe.setFallbackHandler(
          contracts.mainnet.safe.extensibleFallbackHandler
        ),
        targetAddress: recipient as `0x${string}`,
      },
      {
        ...allow.mainnet.safe.extensibleFallbackHandler.setDomainVerifier(
          domainSeparator,
          contracts.mainnet.cowSwap.composableCow
        ),
        targetAddress: recipient as `0x${string}`,
      },
      allow.mainnet.cowSwap.composableCow.createWithContext(
        {
          handler: TWAP,
          // staticInput structure: https://github.com/cowprotocol/composable-cow
          staticInput: c.abiEncodedMatches(
            [
              c.or(...(updatedSell as [string, string, ...string[]])),
              c.or(...(updatedBuy as [string, string, ...string[]])),
              c.avatar,
            ],
            ["address", "address", "address"]
          ),
        },
        currentBlockTimestampFactory,
        "0x"
      )
    )
  } else {
    permissions.push(
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
  }

  return permissions
}
