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
      console.error(e)

      if (e instanceof NotFoundError) {
        res.status(404).json({ error: e.message })
      }

      if (e instanceof Error && "errors" in e) {
        res.status(400).json({ error: fromZodError(e as ZodError).message })
      }

      res.status(500).json({ error: "Internal Server Error" })
    }
  }

interface ErrorJson {
  error: string
}
