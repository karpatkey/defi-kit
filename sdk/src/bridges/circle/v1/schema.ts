import { z } from "zod"
import circleChains from "./_bridgeInfo"

const zChainDescriptions = z.enum(
  circleChains.map((chain) => chain.description) as [string, ...string[]]
)
const zAddress = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")

export const eth = {
  bridge: z.object({
    targets: z.array(zChainDescriptions),
    recipient: zAddress,
  }),

  receive: z.object({
    targets: z.array(zChainDescriptions),
    recipient: zAddress,
    sender: zAddress,
  }),
}

export const arb1 = {
  bridge: z.object({
    targets: z.array(zChainDescriptions),
    recipient: zAddress,
  }),

  receive: z.object({
    targets: z.array(zChainDescriptions),
    recipient: zAddress,
    sender: zAddress,
  }),
}

export const oeth = {
  bridge: z.object({
    targets: z.array(zChainDescriptions),
    recipient: zAddress,
  }),

  receive: z.object({
    targets: z.array(zChainDescriptions),
    recipient: zAddress,
    sender: zAddress,
  }),
}

export const base = {
  bridge: z.object({
    targets: z.array(zChainDescriptions),
    recipient: zAddress,
  }),

  receive: z.object({
    targets: z.array(zChainDescriptions),
    recipient: zAddress,
    sender: zAddress,
  }),
}
