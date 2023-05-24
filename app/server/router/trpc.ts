import { initTRPC } from "@trpc/server"
import { OpenApiMeta } from "trpc-openapi"

export const t = initTRPC.meta<OpenApiMeta>().create()
