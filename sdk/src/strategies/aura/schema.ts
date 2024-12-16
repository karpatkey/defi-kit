import { z } from "zod"
import ethPools from "../../protocols/aura/_ethPools"
import gnoPools from "../../protocols/aura/_gnoPools"
import arb1Pools from "../../protocols/aura/_arb1Pools"
import oethPools from "../../protocols/aura/_oethPools"
import basePools from "../../protocols/aura/_basePools"

const ethRewarders = [...new Set(ethPools.map((pool) => pool.rewarder))]
const gnoRewarders = [...new Set(gnoPools.map((pool) => pool.rewarder))]
const arb1Rewarders = [...new Set(arb1Pools.map((pool) => pool.rewarder))]
const oethRewarders = [...new Set(oethPools.map((pool) => pool.rewarder))]
const baseRewarders = [...new Set(basePools.map((pool) => pool.rewarder))]

const zEthRewarder = z.enum(ethRewarders as [string, string, ...string[]])
const zGnoRewarder = z.enum(gnoRewarders as [string, string, ...string[]])
const zArb1Rewarder = z.enum(arb1Rewarders as [string, string, ...string[]])
const zOethRewarder = z.enum(oethRewarders as [string, string, ...string[]])
const zBaseRewarder = z.enum(baseRewarders as [string, string, ...string[]])

export const eth = {
  withdraw: z.object({
    rewarder: zEthRewarder,
  }),

  withdraw_proportional: z.object({
    rewarder: zEthRewarder,
  }),

  withdraw_single_token: z.object({
    rewarder: zEthRewarder,
    exitTokenIndex: z.number().nonnegative().int().optional(),
  }),
}

export const gno = {
  withdraw: z.object({
    rewarder: zGnoRewarder,
  }),

  withdraw_proportional: z.object({
    rewarder: zGnoRewarder,
  }),

  withdraw_single_token: z.object({
    rewarder: zGnoRewarder,
    exitTokenIndex: z.number().nonnegative().int().optional(),
  }),
}

export const arb1 = {
  withdraw: z.object({
    rewarder: zArb1Rewarder,
  }),

  withdraw_proportional: z.object({
    rewarder: zArb1Rewarder,
  }),

  withdraw_single_token: z.object({
    rewarder: zArb1Rewarder,
    exitTokenIndex: z.number().nonnegative().int().optional(),
  }),
}

export const oeth = {
  withdraw: z.object({
    rewarder: zOethRewarder,
  }),

  withdraw_proportional: z.object({
    rewarder: zOethRewarder,
  }),

  withdraw_single_token: z.object({
    rewarder: zOethRewarder,
    exitTokenIndex: z.number().nonnegative().int().optional(),
  }),
}

export const base = {
  withdraw: z.object({
    rewarder: zBaseRewarder,
  }),

  withdraw_proportional: z.object({
    rewarder: zBaseRewarder,
  }),

  withdraw_single_token: z.object({
    rewarder: zBaseRewarder,
    exitTokenIndex: z.number().nonnegative().int().optional(),
  }),
}
