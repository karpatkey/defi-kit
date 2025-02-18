import { CircleChain } from "./types"
import circleChains from "./_bridgeInfo"
import { NotFoundError } from "../../../errors"
import { Chain } from "../../../types"
import { bridge, receive } from "./actions"

export const findChain = (
  chainOrDescription: string
) => {
  const chainOrDescriptionLower = chainOrDescription.toLowerCase()
  const chain = circleChains.find(
    (chain) =>
      chain.chain.toLowerCase() === chainOrDescriptionLower ||
      chain.description.toLowerCase() === chainOrDescriptionLower
  )
  if (!chain) {
    throw new NotFoundError(`Chain "${chainOrDescription}" not found.`)
  }

  return chain
}

export const eth = {
  bridge: async ({
    targets,
    recipient,
  }: {
    targets: (CircleChain["chain"] | CircleChain["description"])[]
    recipient: `0x${string}`
  }) => {
    return targets.flatMap((target) => {
      const destinationChain = findChain(target)

      if (destinationChain.chain === Chain.eth) {
        throw new NotFoundError(
          `Source and destination chains cannot be the same: "${destinationChain.chain}"`
        )
      }

      return bridge(Chain.eth, destinationChain, recipient)
    })
  },

  receive: async ({
    targets,
    recipient,
    sender,
  }: {
    targets: (CircleChain["chain"] | CircleChain["description"])[]
    recipient: `0x${string}`,
    sender: `0x${string}`,
  }) => {
    return targets.flatMap((target) =>
      receive(
        findChain(target),
        Chain.eth,
        sender,
        recipient,
      )
    )
  },
}
