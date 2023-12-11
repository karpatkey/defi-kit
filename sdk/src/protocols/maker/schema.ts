import { z } from "zod"
import gems from "./_info"
import { Gem, Cdp } from "./types"


export const eth = {
  deposit: z.object({
    proxy: z.string(),
    cdps: 
  }),
}
