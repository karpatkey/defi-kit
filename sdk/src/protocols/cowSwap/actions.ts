import { Chain } from "../../types"
import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve, oneOf } from "../../conditions"
import { c, Permission } from "zodiac-roles-sdk"
import { getWrappedNativeToken } from "./utils"
import { contracts } from "../../../eth-sdk/config"
import { ZeroAddress } from "ethers"

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
    appData?: `0x${string}` | `0x${string}`[]
    twap?: boolean
    receiver?: `0x${string}`
  },
  chain: Chain
) => {
  const { sell, buy, feeAmountBp, appData, twap = false, receiver } = options
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
    if (receiver === undefined) {
      throw new Error(
        "If `twap` is `true` then `receiver` must be a valid address."
      )
    }
  }

  // `appData` is the keccak256 hash of the order's app data document. It is part
  // of the signed order digest, and CoW reads `metadata.partnerFee` out of that
  // document, so leaving it unscoped lets a role member route a fee of up to
  // 100 bps of the traded volume to an address of their choosing. Pinning the
  // hash pins the document.
  const appDataValues =
    appData === undefined
      ? undefined
      : Array.isArray(appData)
      ? appData
      : [appData]

  if (appDataValues) {
    if (appDataValues.length === 0) {
      throw new Error(
        "`appData` must not be an empty array. Pass `undefined` if you want to allow any app data."
      )
    }
    for (const value of appDataValues) {
      if (!/^0x[0-9a-fA-F]{64}$/.test(value)) {
        throw new Error(
          `\`appData\` must be a 32 byte hex string, got: ${value}`
        )
      }
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
    appData: appDataValues && oneOf(appDataValues),
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
        targetAddress: receiver as `0x${string}`,
      },
      {
        ...allow.mainnet.safe.extensibleFallbackHandler.setDomainVerifier(
          domainSeparator,
          contracts.mainnet.cowSwap.composableCow
        ),
        targetAddress: receiver as `0x${string}`,
      },
      allow.mainnet.cowSwap.composableCow.createWithContext(
        {
          handler: TWAP,
          // staticInput structure: https://github.com/cowprotocol/composable-cow
          // Only the leading fields named here are inspected by the Roles
          // modifier; any trailing word of the struct is left unconstrained. So
          // `appData` has to be spelled out all the way at index 9 to be
          // scopeable, with the untouched fields in between left `undefined`.
          staticInput: c.abiEncodedMatches(
            [
              c.or(...(updatedSell as [string, string, ...string[]])),
              c.or(...(updatedBuy as [string, string, ...string[]])),
              c.or(c.avatar, ZeroAddress),
              undefined, // partSellAmount
              undefined, // minPartLimit
              undefined, // t0
              undefined, // n
              undefined, // t
              undefined, // span
              appDataValues && oneOf(appDataValues),
            ],
            [
              "address",
              "address",
              "address",
              "uint256",
              "uint256",
              "uint256",
              "uint256",
              "uint256",
              "uint256",
              "bytes32",
            ]
          ),
        },
        currentBlockTimestampFactory,
        "0x"
      )
    )
  } else {
    permissions.push(
      // `feeAmountBP` caps the order's `feeAmount` at
      // `sellAmount * feeAmountBP / 10000 + 1`. Left unscoped a member could
      // pass 10000 and sign away the entire sell amount as "fee", so it
      // defaults to 0 (i.e. at most 1 wei) unless a cap is asked for.
      allow.mainnet.cowSwap.orderSigner.signOrder(
        orderStructScoping,
        undefined,
        c.lte(feeAmountBp ?? 0),
        { delegatecall: true }
      ),

      allow.mainnet.cowSwap.orderSigner.unsignOrder(undefined, {
        delegatecall: true,
      })
    )
  }

  return permissions
}
