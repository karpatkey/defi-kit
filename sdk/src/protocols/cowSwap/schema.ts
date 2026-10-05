import { z } from "zod"
import { zx } from "../../zx"

// Factory function to create the swap schema based on token type
const createSwapSchema = (tokenType: "ETH" | "XDAI") => {
  return z.object({
    sell: zx.address().or(z.literal(tokenType)).array(),
    buy: zx.address().or(z.literal(tokenType)).array().optional(),
    feeAmountBp: z.number().int().min(0).max(10000).optional(),
    // Array-only, like `sell`/`buy`: the API's query parser only comma-splits a
    // param whose schema is ZodOptional -> ZodArray, and it wraps a single value
    // into an array. A union of value-or-array would defeat both, so
    // `?appData=0xa,0xb` would 400 and the generated annotation URI (which
    // serialises arrays comma-joined) would be unresolvable.
    appData: zx.bytes32().array().optional(),
    twap: z.boolean().optional(),
    receiver: zx.address().optional(),
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
