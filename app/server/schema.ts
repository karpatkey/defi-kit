import { Chain, encodeBytes32String, zx } from "defi-kit"
import { arrayify } from "ethers/lib/utils"
import z from "zod"

export const roleKey = z.string().transform((val, ctx) => {
  try {
    return encodeBytes32String(val)
  } catch (e1) {
    // string is too long to be encoded as bytes32, check if it's a bytes32 already
    try {
      const data = arrayify(val)
      if (data.length === 32 && data[31] === 0) {
        return val
      }
      // hex string is not a bytes32
    } catch (e2) {
      // string is not a hex string
    }
  }

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: "Invalid role key",
  })

  return z.NEVER
})

export const prefixedAddress = z.string().transform((val, ctx) => {
  const components = val.split(":")
  if (components.length !== 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid ERC-3770 address",
    })
    return z.NEVER
  }

  const chainPrefix = components[0].toLowerCase()
  if (!(chainPrefix in Chain)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid chain prefix: '${chainPrefix}'`,
    })
    return z.NEVER
  }

  const address = zx.address().safeParse(components[1])
  if (!address.success) {
    address.error.issues.forEach(ctx.addIssue)
    return z.NEVER
  }

  return { chain: chainPrefix as Chain, address: address.data }
})

// request query params used by all endpoints, used for parsing next.js request query params
export const queryBase = z.object({
  mod: prefixedAddress, // in next.js routes we can only extract full path components, so the `mod` param includes the chain prefix
  role: roleKey,
  protocol: z.string(),
})

// request params used by all endpoints, used for generating API docs
export const docParams = z.object({
  mod: zx.address(), // in the OpenAPI routes, we hardcode the chain prefix in the path, so the `mod` param is just an address
  role: roleKey,
})

export const transactionsJson = z.object({
  version: z.string(),
  chainId: z.string(),
  meta: z.object({
    name: z.string(),
    description: z.string(),
    txBuilderVersion: z.string(),
  }),
  createdAt: z.number(),
  transactions: z.array(
    z.object({
      to: z.string(),
      data: z.string(),
      value: z.string(),
    })
  ),
})

export type TransactionsJson = z.infer<typeof transactionsJson>
