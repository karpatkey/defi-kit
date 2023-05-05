import { appRouter } from "@/server/router"
import { createOpenApiNextHandler } from "trpc-openapi"

export default createOpenApiNextHandler({ router: appRouter })
