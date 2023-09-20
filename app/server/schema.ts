import { Chain, encodeBytes32String, zx } from "defi-kit"
import { arrayify } from "ethers/lib/utils"
import z from "zod"
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"

extendZodWithOpenApi(z)

export const roleKey = z.string().transform((val, ctx) => {
  try {
    return encodeBytes32String(val) as `0x${string}`
  } catch (e1) {
    // string is too long to be encoded as bytes32, check if it's a bytes32 already
    try {
      const data = arrayify(val)
      if (data.length === 32 && data[31] === 0) {
        return val as `0x${string}`
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

const chain = z.nativeEnum(Chain)

export const prefixedAddress = z.string().transform((val, ctx) => {
  const components = val.split(":")
  if (components.length !== 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid ERC-3770 address",
    })
    return z.NEVER
  }

  const chainPrefix = chain.safeParse(components[0])
  if (!chainPrefix.success) {
    chainPrefix.error.issues.forEach(ctx.addIssue)
    return z.NEVER
  }

  const address = zx.address().safeParse(components[1])
  if (!address.success) {
    address.error.issues.forEach(ctx.addIssue)
    return z.NEVER
  }

  return { chain: chainPrefix.data, address: address.data }
})

// request query params used by all permissions endpoints (permissions/...) , used for parsing next.js request query params
export const permissionsQueryBase = z.object({
  chain: chain,
  protocol: z.string(),
})

// request query params used by all transactions ([mod/[role]/...) endpoints, used for parsing next.js request query params
export const transactionsQueryBase = z.object({
  mod: prefixedAddress, // in next.js routes we can only extract full path components, so the `mod` param includes the chain prefix
  role: roleKey,
  protocol: z.string(),
})

// request params used by all transactions endpoints, used for generating API docs
export const transactionsDocParams = z.object({
  mod: zx.address(), // in the OpenAPI routes, we hardcode the chain prefix in the path, so the `mod` param is just an address
  role: roleKey,
})

const baseContractInput = z.object({
  internalType: z.string(),
  name: z.string(),
  type: z.string(),
})
type ContractInput = z.infer<typeof baseContractInput> & {
  components?: ContractInput[]
}
export const contractInput: z.ZodType<ContractInput> = baseContractInput
  .extend({
    children: z.lazy(() => condition.array()).optional(),
  })
  .openapi({
    type: "object",
    properties: {
      internalType: {
        type: "string",
      },
      name: {
        type: "string",
      },
      type: {
        type: "string",
      },
      components: {
        type: "array",
        items: {
          $ref: "#/components/schemas/ContractInput", // we're registering the schema as a component in openapi.ts
        },
      },
    },
    required: ["internalType", "name", "type"],
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
      data: z.string().optional(),
      value: z.string(),
      contractMethod: z
        .object({
          name: z.string(),
          payable: z.boolean(),
          inputs: z.array(contractInput),
        })
        .optional(),
      contractInputsValues: z.record(z.string()).optional(),
    })
  ),
})

export type TransactionsJson = z.infer<typeof transactionsJson>

const baseCondition = z.object({
  paramType: z.number(),
  operator: z.number(),
  compValue: z.string().optional(),
})

type Condition = z.infer<typeof baseCondition> & {
  children?: Condition[]
}

export const condition: z.ZodType<Condition> = baseCondition
  .extend({
    children: z.lazy(() => condition.array()).optional(),
  })
  .openapi({
    type: "object",
    properties: {
      paramType: {
        type: "number",
      },
      operator: {
        type: "number",
      },
      compValue: {
        type: "string",
      },
      children: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Condition", // we're registering the schema as a component in openapi.ts
        },
      },
    },
    required: ["paramType", "operator"],
  })

export const permission = z.object({
  targetAddress: z.string(), // we don't use zx.address() here because PermissionSet.targetAddress is typed as string
  selector: z.string().optional(),
  send: z.boolean().optional(),
  delegateCall: z.boolean().optional(),
  condition: condition.optional(),
})

export type Permission = z.infer<typeof permission>

export type ResponseJson = TransactionsJson | Permission[]
