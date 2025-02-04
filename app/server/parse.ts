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

      if (
        hasType(fieldSchema, z.ZodFirstPartyTypeKind.ZodArray) &&
        !Array.isArray(value)
      ) {
        return [key, value?.split(",")]
      }

      if (hasType(fieldSchema, z.ZodFirstPartyTypeKind.ZodNumber)) {
        return [key, Number(value)]
      }

      if (hasType(fieldSchema, z.ZodFirstPartyTypeKind.ZodBoolean)) {
        return [key, value === "true"]
      }

      return [key, value]
    })
  )

  return schema.parse(coercedQuery)
}

const hasType = (schema: any, typeName: z.ZodFirstPartyTypeKind) => {
  if (!schema) return false
  return (
    schema._def.typeName === typeName ||
    (schema._def.typeName === "ZodOptional" &&
      schema._def.innerType?._def.typeName == typeName)
  )
}
