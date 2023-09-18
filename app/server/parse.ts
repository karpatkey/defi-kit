import { NextApiRequest } from "next"
import z, { AnyZodObject, ZodArray, ZodOptional } from "zod"

export function parseQuery<T extends AnyZodObject>(
  query: NextApiRequest["query"],
  schema: T
): z.infer<T> {
  // We support two styles of serializing array params into a query string: bar=1&bar=2 and bar=1,2
  // If an array-type param only has a single item or uses comma-separation, req.query will be string instead of string[]. This will make zod parsing fail.
  // So we pre-process the query object to convert single-item values to arrays.
  const coercedQuery = Object.fromEntries(
    Object.entries(query).map(([key, value]) => {
      const fieldSchema = schema.shape[key]
      const isArrayParam =
        fieldSchema?._def.typeName === "ZodArray" ||
        (fieldSchema?._def.typeName === "ZodOptional" &&
          fieldSchema._def.innerType?._def.typeName == "ZodArray")

      if (isArrayParam && !Array.isArray(value)) {
        return [key, value?.split(",")]
      }
      return [key, value]
    })
  )

  return schema.parse(coercedQuery)
}
