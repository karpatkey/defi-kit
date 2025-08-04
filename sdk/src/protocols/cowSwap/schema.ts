import { z } from "zod"
import { zx } from "../../zx"

// Factory function to create the swap schema based on token type
const createSwapSchema = (tokenType: "ETH" | "XDAI") => {
  return z.object({
    sell: zx.address().or(z.literal(tokenType)).array(),
    buy: zx.address().or(z.literal(tokenType)).array().optional(),
    feeAmountBp: z.number().int().min(0).max(10000).optional(),
    twap: z.boolean().optional(),
    recipient: zx.address().optional(),
  })
}

// Define schemas for ETH and XDAI
const swapEth = createSwapSchema("ETH")
const swapGno = createSwapSchema("XDAI")

// Export schemas
export const eth = {
  swap: swapEth,
}

export const gno = {
  swap: swapGno,
}

export const arb1 = {
  swap: swapEth,
}

export const base = {
  swap: swapEth,
}
