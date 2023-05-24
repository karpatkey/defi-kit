import { initTRPC } from "@trpc/server"
import { encodeBytes32String } from "defi-presets"
import * as mainnet from "defi-presets/mainnet"
import { arrayify } from "@ethersproject/bytes"
import { OpenApiMeta } from "trpc-openapi"
import { z } from "zod"
import { mapError } from "./errors"

const t = initTRPC.meta<OpenApiMeta>().create()

const sdk = {
  eth: mainnet,
  // gor: 5,
  // bnb: 56,
  // gno: 100,
  // matic: 137,
  // arb1: 42161,
} as const

const ADDRESS = /^0x[0-9a-fA-F]{40}$/

// const shortNames = Object.keys(NETWORKS).join("|")
// const ERC3770_ADDRESS = new RegExp(`^${shortNames}\\:0x[0-9a-fA-F]{40}$`)

export const appRouter = t.router({
  mainnet: {
    allow: {
      curve: {
        deposit: t.procedure
          .meta({
            openapi: {
              method: "GET",
              path: "/eth:{mod}/{role}/allow/curve/deposit",
              summary: "Allow managing deposits to the `target` curve pool",
              description:
                "Responds the calls required for configuring the role to allow making deposits and withdrawals to the curve pool specified by `target`.",
              tags: ["curve"],
            },
          })
          .input(
            z.object({
              mod: z.string().regex(ADDRESS),
              role: z.string(),
              target: z.string(),
            })
          )
          .output(
            z.object({
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
          )
          .query(async (opts) => {
            const { roleKey, modAddress } = parseInputs(opts.input)
            try {
              const entries = mainnet.allow.curve.deposit(
                opts.input.target as any
              )
              const calls = await mainnet.apply(roleKey, entries, {
                address: modAddress,
                mode: "extend",
              })
              return mainnet.exportJson(modAddress, calls, {
                name: `Extend permissions of "${opts.input.role}" role`,
                description: "",
              })
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
  },
})

export type AppRouter = typeof appRouter

const parseInputs = (inputs: { mod: string; role: string }) => {
  // const [chainPrefix, address] = inputs.mod.split(":")
  // const network = NETWORKS[chainPrefix as keyof typeof NETWORKS] // this is safe since already checked by the regex

  let roleKey: string | undefined = undefined
  try {
    roleKey = encodeBytes32String(inputs.role)
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
    modAddress: inputs.mod as `0x${string}`,
  }
}
