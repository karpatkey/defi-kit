import { CircleChain } from "./types"
import { Permission, c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve } from "../../../conditions"
import { contracts } from "../../../../eth-sdk/config"
import { Chain } from "../../../types"
import { BytesLike } from "ethers"

const _getAddresses = (chain: Chain) => {
  switch (chain) {
    case Chain.eth:
      return {
        tokenMessenger: contracts.mainnet.circleV2
          .tokenMessenger as `0x${string}`,
        messageTransmitter: contracts.mainnet.circleV2
          .messageTransmitter as `0x${string}`,
        usdc: contracts.mainnet.usdc,
      }

    case Chain.arb1:
      return {
        tokenMessenger: contracts.arbitrumOne.circleV2
          .tokenMessenger as `0x${string}`,
        messageTransmitter: contracts.arbitrumOne.circleV2
          .messageTransmitter as `0x${string}`,
        usdc: contracts.arbitrumOne.usdc,
      }

    case Chain.oeth:
      return {
        tokenMessenger: contracts.optimism.circleV2
          .tokenMessenger as `0x${string}`,
        messageTransmitter: contracts.optimism.circleV2
          .messageTransmitter as `0x${string}`,
        usdc: contracts.optimism.usdc,
      }

    case Chain.base:
      return {
        tokenMessenger: contracts.base.circleV2.tokenMessenger as `0x${string}`,
        messageTransmitter: contracts.base.circleV2
          .messageTransmitter as `0x${string}`,
        usdc: contracts.base.usdc,
      }

    default:
      throw new Error(`Unsupported Chain: ${chain}`)
  }
}

export const bridge = (
  sourceChain: Chain,
  destinationChain: CircleChain,
  recipient: `0x${string}`
) => {
  const { tokenMessenger, usdc } = _getAddresses(sourceChain)

  const permissions: Permission[] = [
    ...allowErc20Approve([usdc], [tokenMessenger]),
    {
      ...allow.mainnet.circleV2.tokenMessenger.depositForBurn(
        undefined,
        destinationChain.domain,
        "0x" + recipient.slice(2).padStart(64, "0"),
        usdc
      ),
      targetAddress: tokenMessenger,
    },
  ]

  return permissions
}

export const receive = (
  sourceChain: CircleChain,
  destinationChain: CircleChain,
  sender: `0x${string}`,
  recipient: `0x${string}`
) => {
  const { tokenMessenger: sourceTokenMessenger, usdc: sourceUsdc } =
    _getAddresses(sourceChain.chain as Chain)

  const {
    tokenMessenger: destinationTokenMessenger,
    messageTransmitter: destinationMessageTransmitter,
  } = _getAddresses(destinationChain.chain as Chain)
  return [
    {
      ...allow.mainnet.circleV2.messageTransmitter.receiveMessage(
        c.and(
          // version: 4 bytes
          // source domain: 4 bytes
          // destination domain: 4 bytes
          c.bitmask({
            shift: 0,
            mask: "0xffffffffffffffffffffffff",
            value:
              "0x" +
              "00000001" +
              sourceChain.domain.padStart(8, "0") +
              destinationChain.domain.padStart(8, "0"),
          }),
          // skip nonce 32 bytes
          // sender: 32 bytes
          // skip the first 12 bytes of the address with 0's
          // Source Circle Token Messenger
          c.bitmask({
            shift: 44 + 12, // 56 bytes = 12 bytes (version + source domain + destination domain) + 32 bytes (nonce) + 12 bytes of 0's 
            mask: "0xffffffffffffffffffff",
            value: sourceTokenMessenger.slice(0, 22),
          }),
          c.bitmask({
            shift: 44 + 12 + 10,
            mask: "0xffffffffffffffffffff",
            value: "0x" + sourceTokenMessenger.slice(22, 42),
          }),
          // recipient: 32 bytes
          // skip the first 12 bytes of the address with 0's
          // Destination Circle Token Messenger
          c.bitmask({
            shift: 44 + 32 + 12,
            mask: "0xffffffffffffffffffff",
            value: destinationTokenMessenger.slice(0, 22),
          }),
          c.bitmask({
            shift: 44 + 32 + 12 + 10,
            mask: "0xffffffffffffffffffff",
            value: "0x" + destinationTokenMessenger.slice(22, 42),
          }),
          // message body: dynamic
          // skip 44 bytes = destinationCaller (32 bytes) + minFinalityThreshold (4 bytes) + finalityThresholdExecuted (4 bytes) + messageBody selector (4 bytes)
          // Bridged Token: USDC
          // skip the first 12 bytes of the address with 0's
          c.bitmask({
            shift: 44 + 32 + 32 + 44 + 12,
            mask: "0xffffffffffffffffffff",
            value: sourceUsdc.slice(0, 22),
          }),
          c.bitmask({
            shift: 44 + 32 + 32 + 44 + 12 + 10,
            mask: "0xffffffffffffffffffff",
            value: "0x" + sourceUsdc.slice(22, 42),
          }),
          // Recipient
          // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
          c.bitmask({
            shift: 44 + 32 + 32 + 44 + 32 + 12,
            mask: "0xffffffffffffffffffff",
            value: recipient.slice(0, 22), // First 10 bytes of the avatar address
          }),
          c.bitmask({
            shift: 44 + 32 + 32 + 44 + 32 + 12 + 10,
            mask: "0xffffffffffffffffffff",
            value: "0x" + recipient.slice(22, 42), // Last 10 bytes of the avatar address
          }),
          // skip 32 bytes chunk corresponding to the amount
          // skip the first 12 bytes (0's) of the address and scope the first 10 bytes
          // Sender
          c.bitmask({
            shift: 44 + 32 + 32 + 44 + 32 + 32 + 32 + 12,
            mask: "0xffffffffffffffffffff",
            value: sender.slice(0, 22), // First 10 bytes of the avatar address
          }),
          c.bitmask({
            shift: 44 + 32 + 32 + 44 + 32 + 32 + 32 + 12 + 10,
            mask: "0xffffffffffffffffffff",
            value: "0x" + sender.slice(22, 42), // Last 10 bytes of the avatar address
          })
        )
      ),
      targetAddress: destinationMessageTransmitter,
    },
  ]
}
