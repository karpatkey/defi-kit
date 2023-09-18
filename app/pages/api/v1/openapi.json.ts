import { NextApiRequest, NextApiResponse } from "next"
import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi"

import { registry } from "@/server/openapi"
import { OpenAPIObject } from "openapi3-ts/oas31"

// Respond with our OpenAPI schema
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const generator = new OpenApiGeneratorV31(registry.definitions)
  const document = dontExplodedArrayParams(
    generator.generateDocument({
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "DeFi Kit",
        description:
          "Permissions for Zodiac Roles covering interactions with DeFi protocols",
      },
      servers: [{ url: "/api/v1" }],
    })
  )

  res.status(200).send(document)
}

export default handler

function dontExplodedArrayParams(doc: OpenAPIObject): OpenAPIObject {
  if (!doc.paths) return doc

  for (let [, item] of Object.entries(doc.paths)) {
    if (item.get?.parameters) {
      for (let parameter of item.get.parameters) {
        if ("$ref" in parameter) continue
        parameter.explode = false
      }
    }
  }

  return doc
}
