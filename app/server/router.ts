import { initTRPC } from "@trpc/server"

import { OpenApiMeta } from "trpc-openapi"
import { z } from "zod"

const t = initTRPC.meta<OpenApiMeta>().create()

export const appRouter = t.router({
  hello: t.procedure
    .meta({ /* 👉 */ openapi: { method: "GET", path: "/hello" } })
    .input(
      z.object({
        text: z.string(),
      })
    )
    .output(z.object({ greeting: z.string() }))
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      }
    }),
  hi: t.procedure
    .meta({ /* 👉 */ openapi: { method: "GET", path: "/hi" } })
    .input(z.void())
    .output(z.string())
    .query(() => "hello tRPC v10!"),
})

export type AppRouter = typeof appRouter
