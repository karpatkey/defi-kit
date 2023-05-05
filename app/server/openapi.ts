import { generateOpenApiDocument } from "trpc-openapi"

import { appRouter } from "./router"

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "DeFi Presets",
  description: "Permission presets covering interactions with DeFi protocols",
  version: "1.0.0",
  baseUrl: "http://localhost:3000/api/v1/",
})
