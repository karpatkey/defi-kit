import { NotFoundError } from "defi-presets"
import { TRPCError } from "@trpc/server"

/** Map defi-presets errors to tRPC errors */
export const mapError = (error: unknown) => {
  if (error instanceof NotFoundError) {
    return new TRPCError({
      code: "NOT_FOUND",
      message: error.message,
      cause: error.cause,
    })
  }

  return error
}
