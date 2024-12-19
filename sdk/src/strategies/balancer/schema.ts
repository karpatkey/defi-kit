import { z } from "zod"
import ethPools from "../../protocols/balancer/_ethPools"
import gnoPools from "../../protocols/balancer/_gnoPools"
import arb1Pools from "../../protocols/balancer/_arb1Pools"
import oethPools from "../../protocols/balancer/_oethPools"
import basePools from "../../protocols/balancer/_basePools"

const ethBpts = [...new Set(ethPools.map((pool) => pool.bpt))]
const gnoBpts = [...new Set(gnoPools.map((pool) => pool.bpt))]
const arb1Bpts = [...new Set(arb1Pools.map((pool) => pool.bpt))]
const oethBpts = [...new Set(oethPools.map((pool) => pool.bpt))]
const baseBpts = [...new Set(basePools.map((pool) => pool.bpt))]

const zEthBpt = z.enum(ethBpts as [string, string, ...string[]])
const zGnoBpt = z.enum(gnoBpts as [string, string, ...string[]])
const zArb1Bpt = z.enum(arb1Bpts as [string, string, ...string[]])
const zOethBpt = z.enum(oethBpts as [string, string, ...string[]])
const zBaseBpt = z.enum(baseBpts as [string, string, ...string[]])

const ethGauges = [...new Set(ethPools.map((pool) => pool.gauge))]
const gnoGauges = [...new Set(gnoPools.map((pool) => pool.gauge))]
const arb1Gauges = [...new Set(arb1Pools.map((pool) => pool.gauge))]
const oethGauges = [...new Set(oethPools.map((pool) => pool.gauge))]
const baseGauges = [...new Set(basePools.map((pool) => pool.gauge))]

const zEthGauge = z.enum(ethGauges as [string, string, ...string[]])
const zGnoGauge = z.enum(gnoGauges as [string, string, ...string[]])
const zArb1Gauge = z.enum(arb1Gauges as [string, string, ...string[]])
const zOethGauge = z.enum(oethGauges as [string, string, ...string[]])
const zBaseGauge = z.enum(baseGauges as [string, string, ...string[]])

export const eth = {
  withdraw_proportional: z.object({
    bpt: zEthBpt,
  }),

  withdraw_single_token: z.object({
    bpt: zEthBpt,
  }),

  unstake_withdraw_proportional: z.object({
    gauge: zEthGauge,
  }),

  unstake_withdraw_single: z.object({
    gauge: zEthGauge,
  }),
}

export const gno = {
  withdraw_proportional: z.object({
    bpt: zGnoBpt,
  }),

  withdraw_single_token: z.object({
    bpt: zGnoBpt,
  }),

  unstake_withdraw_proportional: z.object({
    gauge: zGnoGauge,
  }),

  unstake_withdraw_single: z.object({
    gauge: zGnoGauge,
  }),
}

export const arb1 = {
  withdraw_proportional: z.object({
    bpt: zArb1Bpt,
  }),

  withdraw_single_token: z.object({
    bpt: zArb1Bpt,
  }),

  unstake_withdraw_proportional: z.object({
    gauge: zArb1Gauge,
  }),

  unstake_withdraw_single: z.object({
    gauge: zArb1Gauge,
  }),
}

export const oeth = {
  withdraw_proportional: z.object({
    bpt: zOethBpt,
  }),

  withdraw_single_token: z.object({
    bpt: zOethBpt,
  }),

  unstake_withdraw_proportional: z.object({
    gauge: zOethGauge,
  }),

  unstake_withdraw_single: z.object({
    gauge: zOethGauge,
  }),
}

export const base = {
  withdraw_proportional: z.object({
    bpt: zBaseBpt,
  }),

  withdraw_single_token: z.object({
    bpt: zBaseBpt,
  }),

  unstake_withdraw_proportional: z.object({
    gauge: zBaseGauge,
  }),

  unstake_withdraw_single: z.object({
    gauge: zBaseGauge,
  }),
}
