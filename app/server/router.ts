import { initTRPC } from "@trpc/server"
import { applyPermissions, Target } from "zodiac-roles-sdk"
import { allow } from "defi-presets"
import { formatBytes32String } from "@ethersproject/strings"
import { arrayify } from "@ethersproject/bytes"
import { OpenApiMeta } from "trpc-openapi"
import { z } from "zod"

const t = initTRPC.meta<OpenApiMeta>().create()

const NETWORKS = {
  eth: 1,
  gor: 5,
  bnb: 56,
  gno: 100,
  matic: 137,
  arb1: 42161,
} as const

const apply = async (
  inputs: { mod: string; role: string },
  permissions: Target[]
) => {
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
  const calls = await applyPermissions(roleKey, permissions, {
    network,
    address,
  })
  return calls
}

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
            tags: ["curve"],
          },
        })
        .input(
          z.object({
            mod: z.string().regex(ERC3770_ADDRESS),
            role: z.string(),
            target: z.string().regex(ADDRESS),
          })
        )
        .output(z.object({ greeting: z.string() }))
        .query((opts) => {
          return {
            greeting: `hello ${opts.input.role}`,
          }
        }),
    },
  },
})

export type AppRouter = typeof appRouter
