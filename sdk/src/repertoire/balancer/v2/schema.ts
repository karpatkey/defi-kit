import { z } from "zod"
import ethPools from "../../../protocols/balancer/v2/_ethPools"
import gnoPools from "../../../protocols/balancer/v2/_gnoPools"
import arb1Pools from "../../../protocols/balancer/v2/_arb1Pools"
import oethPools from "../../../protocols/balancer/v2/_oethPools"
import basePools from "../../../protocols/balancer/v2/_basePools"

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

const ethGauges = [
  ...new Set(
    ethPools.map((pool) => pool.gauge).filter((gauge) => gauge != null)
  ),
]
const gnoGauges = [
  ...new Set(
    gnoPools.map((pool) => pool.gauge).filter((gauge) => gauge != null)
  ),
]
const arb1Gauges = [
  ...new Set(
    arb1Pools.map((pool) => pool.gauge).filter((gauge) => gauge != null)
  ),
]
const oethGauges = [
  ...new Set(
    oethPools.map((pool) => pool.gauge).filter((gauge) => gauge != null)
  ),
]
const baseGauges = [
  ...new Set(
    basePools.map((pool) => pool.gauge).filter((gauge) => gauge != null)
  ),
]

const zEthGauge = z.enum(ethGauges as [string, string, ...string[]])
const zGnoGauge = z.enum(gnoGauges as [string, string, ...string[]])
const zArb1Gauge = z.enum(arb1Gauges as [string, string, ...string[]])
const zOethGauge = z.enum(oethGauges as [string, string, ...string[]])
const zBaseGauge = z.enum(baseGauges as [string, string, ...string[]])

const ethTokenAddresses = [
  ...new Set(
    ethPools.flatMap((pool) => pool.tokens.map((token) => token.address))
  ),
]
const gnoTokenAddresses = [
  ...new Set(
    gnoPools.flatMap((pool) => pool.tokens.map((token) => token.address))
  ),
]
const arb1TokenAddresses = [
  ...new Set(
    arb1Pools.flatMap((pool) => pool.tokens.map((token) => token.address))
  ),
]
const oethTokenAddresses = [
  ...new Set(
    oethPools.flatMap((pool) => pool.tokens.map((token) => token.address))
  ),
]
const baseTokenAddresses = [
  ...new Set(
    basePools.flatMap((pool) => pool.tokens.map((token) => token.address))
  ),
]

const zEthTokenAddress = z.enum(
  ethTokenAddresses as [string, string, ...string[]]
)
const zGnoTokenAddress = z.enum(
  gnoTokenAddresses as [string, string, ...string[]]
)
const zArb1TokenAddress = z.enum(
  arb1TokenAddresses as [string, string, ...string[]]
)
const zOethTokenAddress = z.enum(
  oethTokenAddresses as [string, string, ...string[]]
)
const zBaseTokenAddress = z.enum(
  baseTokenAddresses as [string, string, ...string[]]
)

export const eth = {
  withdraw_proportional: z.object({
    bpt: zEthBpt,
  }),

  withdraw_single: z.object({
    bpt: zEthBpt,
    exitTokenAddress: zEthTokenAddress,
  }),

  unstake_withdraw_proportional: z.object({
    gauge: zEthGauge,
  }),

  unstake_withdraw_single: z.object({
    gauge: zEthGauge,
    exitTokenAddress: zEthTokenAddress,
  }),
}

export const gno = {
  withdraw_proportional: z.object({
    bpt: zGnoBpt,
  }),

  withdraw_single: z.object({
    bpt: zGnoBpt,
    exitTokenAddress: zGnoTokenAddress,
  }),

  unstake_withdraw_proportional: z.object({
    gauge: zGnoGauge,
  }),

  unstake_withdraw_single: z.object({
    gauge: zGnoGauge,
    exitTokenAddress: zGnoTokenAddress,
  }),
}

export const arb1 = {
  withdraw_proportional: z.object({
    bpt: zArb1Bpt,
  }),

  withdraw_single: z.object({
    bpt: zArb1Bpt,
    exitTokenAddress: zArb1TokenAddress,
  }),

  unstake_withdraw_proportional: z.object({
    gauge: zArb1Gauge,
  }),

  unstake_withdraw_single: z.object({
    gauge: zArb1Gauge,
    exitTokenAddress: zArb1TokenAddress,
  }),
}

export const oeth = {
  withdraw_proportional: z.object({
    bpt: zOethBpt,
  }),

  withdraw_single: z.object({
    bpt: zOethBpt,
    exitTokenAddress: zOethTokenAddress,
  }),

  unstake_withdraw_proportional: z.object({
    gauge: zOethGauge,
  }),

  unstake_withdraw_single: z.object({
    gauge: zOethGauge,
    exitTokenAddress: zOethTokenAddress,
  }),
}

export const base = {
  withdraw_proportional: z.object({
    bpt: zBaseBpt,
  }),

  withdraw_single: z.object({
    bpt: zBaseBpt,
    exitTokenAddress: zBaseTokenAddress,
  }),

  unstake_withdraw_proportional: z.object({
    gauge: zBaseGauge,
  }),

  unstake_withdraw_single: z.object({
    gauge: zBaseGauge,
    exitTokenAddress: zBaseTokenAddress,
  }),
}
