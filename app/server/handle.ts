import { NextApiRequest, NextApiResponse } from "next"
import { NotFoundError } from "defi-kit"
import { fromZodError } from "zod-validation-error"
import { ZodError } from "zod"

import { Permission, ResponseJson, TransactionsJson } from "./schema"

export type PermissionsHandler = (
  query: NextApiRequest["query"]
) => Promise<Permission[]>

export type TransactionsHandler = (
  query: NextApiRequest["query"]
) => Promise<TransactionsJson>

export const handle =
  (handler: TransactionsHandler | PermissionsHandler) =>
  async (
    req: NextApiRequest,
    res: NextApiResponse<ResponseJson | ErrorJson>
  ) => {
    try {
      const result = await handler(req.query)
      res.status(200).json(result as any)
    } catch (e) {
      console.error("API Error:", e) // Log the error for debugging

      if (e instanceof NotFoundError) {
        return res.status(404).json({ error: e.message }) // Correctly return 404 errors
      }

      if (e instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(e).message }) // Correctly return validation errors
      }

      if (e instanceof Error) {
        return res.status(400).json({ error: e.message }) // Send actual error message to UI
      }

      res.status(500).json({ error: "Internal Server Error" }) // Default fallback for unexpected errors
    }
  }

interface ErrorJson {
  error: string
}
