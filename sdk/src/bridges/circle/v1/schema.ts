import { z } from "zod"
import circleChains from "./_bridgeInfo"

const zChainDescriptions = z.enum(circleChains.map((chain) => chain.description) as [string, ...string[]])
const zAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")

export const eth = {
  bridge: z.object({
    targets: z.array(zChainDescriptions),
    recipient: zAddress,
  }),
}