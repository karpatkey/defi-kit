import { initTRPC } from "@trpc/server"
import {
  extendPermissions,
  encodeCalls,
  fetchRole,
  Target,
  fillPreset,
  AVATAR,
  PresetAllowEntry,
} from "zodiac-roles-sdk"
import { allow, NotFoundError } from "defi-presets"
import { formatBytes32String } from "@ethersproject/strings"
import { arrayify } from "@ethersproject/bytes"
import { OpenApiMeta } from "trpc-openapi"
import { z } from "zod"
import { mapError } from "./errors"

const t = initTRPC.meta<OpenApiMeta>().create()

const NETWORKS = {
  eth: 1,
  gor: 5,
  bnb: 56,
  gno: 100,
  matic: 137,
  arb1: 42161,
} as const

// Object.entries(allow).

const ADDRESS = /^0x[0-9a-fA-F]{40}$/

const shortNames = Object.keys(NETWORKS).join("|")
const ERC3770_ADDRESS = new RegExp(`^${shortNames}\\:0x[0-9a-fA-F]{40}$`)

export const appRouter = t.router({
  allow: {
    curve: {
      deposit: t.procedure
        .meta({
          openapi: {
            method: "GET",
            path: "/{mod}/allow/{role}/curve/deposit",
            summary: "Allow managing deposits to the `target` curve pool",
            description:
              "Responds the calls required for configuring the role to allow making deposits and withdrawals to the curve pool specified by `target`.",
            tags: ["curve"],
          },
        })
        .input(
          z.object({
            mod: z.string().regex(ERC3770_ADDRESS),
            role: z.string(),
            target: z.string(),
          })
        )
        .output(
          z.object({
            version: z.literal("1.0"),
            chainId: z.string(),
            meta: z.object({
              name: z.string(),
              description: z.string(),
              txBuilderVersion: z.literal("1.13.3"),
            }),
            createdAt: z.number(),
            transactions: z.array(
              z.object({ to: z.string(), data: z.string(), value: z.string() })
            ),
          })
        )
        .query(async (opts) => {
          try {
            const entries = allow.curve.deposit(opts.input.target as any)
            return await deriveCalls(opts.input, entries)
          } catch (e) {
            throw mapError(e)
          }
        }),
    },
  },
  permissions: {
    allow: {
      curve: {},
    },
  },
})

export type AppRouter = typeof appRouter

const parseInputs = (inputs: { mod: string; role: string }) => {
  const [chainPrefix, address] = inputs.mod.split(":")
  const network = NETWORKS[chainPrefix as keyof typeof NETWORKS] // this is safe since already checked by the regex

  let roleKey: string | undefined = undefined
  try {
    roleKey = formatBytes32String(inputs.role)
  } catch (e) {
    // string is too long to be encoded as bytes32, check if it's a bytes32 already
    const data = arrayify(inputs.role)
    if (data.length === 32 && data[31] === 0) {
      roleKey = inputs.role
    }
  }
  if (!roleKey) {
    throw new Error(`Invalid role key: ${inputs.role}`)
  }

  return {
    roleKey,
    network,
    address,
  }
}

const derivePermissions = (entries: PresetAllowEntry[]) =>
  fillPreset({ allow: entries, placeholders: {}, chainId: 1 }, {})

const deriveCalls = async (
  inputs: { mod: string; role: string },
  entries: PresetAllowEntry[]
) => {
  const { roleKey, network, address } = parseInputs(inputs)

  const { targets: current } = await fetchRole({ roleKey, network, address })
  const calls = await extendPermissions(current, derivePermissions(entries))
  const transactions = encodeCalls(roleKey, calls).map((data) => ({
    to: address,
    data,
    value: "0",
  }))

  return {
    version: "1.0",
    chainId: network.toString(10),
    meta: {
      name: `Extend permissions of "${inputs.role}" role`,
      description: "",
      txBuilderVersion: "1.13.3",
    },
    createdAt: Date.now(),
    transactions,
  } as const
}
