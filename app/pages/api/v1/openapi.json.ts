import { NextApiRequest, NextApiResponse } from "next"
import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi"

import { registry } from "@/server/openapi"

// Respond with our OpenAPI schema
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const generator = new OpenApiGeneratorV31(registry.definitions)
  const document = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "DeFi Kit",
      description:
        "Permissions for Zodiac Roles covering interactions with DeFi protocols",
    },
    servers: [{ url: "/api/v1" }],
  })

  res.status(200).send(document)
}

export default handler
