import { NextApiRequest } from "next"
import z, { AnyZodObject } from "zod"

export function parseQuery<T extends AnyZodObject>(
  query: NextApiRequest["query"],
  schema: T
): z.infer<T> {
  // If an array-type param only has a single item, req.query will be string instead of string[]. This will make zod parsing fail.
  // So we pre-process the query object to convert single-item values to arrays.
  const coercedQuery = Object.fromEntries(
    Object.entries(query).map(([key, value]) => {
      const isArrayParam = schema.shape[key] && "element" in schema.shape[key]
      if (isArrayParam && !Array.isArray(value)) {
        return [key, [value]]
      }
      return [key, value]
    })
  )

  return schema.parse(coercedQuery)
}
