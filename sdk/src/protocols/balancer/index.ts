import { 
  EthPool,
  EthToken,
  GnoToken,
  GnoPool,
  Arb1Pool,
  Arb1Token,
  OethPool,
  OethToken,
  BasePool,
  BaseToken,
  Pool,
} from "./types"
import ethPools from "./_ethPools"
import gnoPools from "./_gnoPools"
import arb1Pools from "./_arb1Pools"
import oethPools from "./_oethPools"
import basePools from "./_basePools"
import { NotFoundError } from "../../errors"
import { deposit, stake, lock } from "./actions"
import { Chain } from "../../types"

export const findPool = (pools: readonly Pool[], nameIdOrBpt: string) => {
  const nameIdOrBptLower = nameIdOrBpt.toLowerCase()
  const pool = pools.find(
    (pool) =>
      pool.name.toLowerCase() === nameIdOrBptLower ||
      pool.id.toLowerCase() === nameIdOrBptLower ||
      pool.bpt.toLowerCase() === nameIdOrBptLower
  )
  if (!pool) {
    throw new NotFoundError(`Pool not found: ${nameIdOrBpt}`)
  }
  return pool
}

export const findPoolByGauge = (pools: readonly Pool[], gauge: string) => {
  const gaugeLower = gauge.toLowerCase()
  const pool = pools.find((pool) => pool.gauge?.toLowerCase() === gaugeLower)
  if (!pool) {
    throw new NotFoundError(`Pool not found for gauge: ${gauge}`)
  }
  return pool
}

const filterPoolsByTokens = (
  sell: EthToken[] | undefined,
  buy: EthToken[] | undefined,
  pools: readonly Pool[]
) => {
  return pools.filter((pool) => {
    const poolTokens = pool.tokens.map(
      (token) => token.address
    ) as readonly string[]
    if (sell && sell.length > 0) {
      const hasSell = sell.some((token) => poolTokens.includes(token.address))
      if (!hasSell) {
        return false
      }
    }
    if (buy && buy.length > 0) {
      const hasBuy = buy.some((token) => poolTokens.includes(token.address))
      if (!hasBuy) {
        return false
      }
    }
    return true
  })
}

const findToken = (pools: readonly Pool[], symbolOrAddress: string) => {
  const symbolOrAddressLower = symbolOrAddress.toLowerCase()
  const tokens = pools.flatMap((pool) => [...pool.tokens])
  const token = tokens.find(
    (token) =>
      token.symbol.toLowerCase() === symbolOrAddressLower ||
      token.address.toLowerCase() === symbolOrAddressLower
  )
  if (!token) {
    throw new NotFoundError(`Token not found: ${symbolOrAddress}`)
  }
  return token
}

export const findTokenIndexInPool = (
  pools: readonly Pool[],
  bpt: string,
  tokenAddress: string
): number => {
  const bptLower = bpt.toLowerCase()
  const tokenAddressLower = tokenAddress.toLowerCase()

  // Find the pool based on the BPT address
  const pool = pools.find((pool) => pool.bpt.toLowerCase() === bptLower)
  if (!pool) {
    throw new NotFoundError(`Pool not found for BPT: ${bpt}`)
  }

  // Find the index of the token within the pool
  const tokenIndex = pool.tokens.findIndex(
    (token) => token.address.toLowerCase() === tokenAddressLower
  )
  if (tokenIndex === -1) {
    throw new NotFoundError(
      `Token with address ${tokenAddress} not found in pool: ${bpt}`
    )
  }

  // Ensure the function always returns a number
  return tokenIndex
}

export const eth = {
  deposit: async ({
    targets,
    tokens,
  }: {
    // "targets" is a mandatory parameter
    targets: (EthPool["name"] | EthPool["bpt"] | EthPool["id"])[]
    tokens?: (EthToken["address"] | EthToken["symbol"])[]
  }) => {
    return targets.flatMap((target) =>
      deposit(
        findPool(ethPools, target),
        tokens?.map((addressOrSymbol) => findToken(ethPools, addressOrSymbol))
      )
    )
  },

  stake: async (options: {
    targets: (EthPool["name"] | EthPool["bpt"] | EthPool["id"])[]
  }) =>
    options.targets.flatMap((target) =>
      stake(Chain.eth, findPool(ethPools, target))
    ),

  lock: async () => {
    return lock()
  },

  // swap: async (options: {
  //   sell?: (EthToken["address"] | EthToken["symbol"])[]
  //   buy?: (EthToken["address"] | EthToken["symbol"])[]
  //   pools?: (EthPool["name"] | EthPool["bpt"] | EthPool["id"])[]
  // }) =>
  //   filterPoolsByTokens(
  //     options.sell?.map(findToken),
  //     options.buy?.map(findToken),
  //     options.pools
  //       ? options.pools.map((addressOrName) =>
  //           findPool(ethPools, addressOrName)
  //         )
  //       : ethPools
  //   ).flatMap((pool) =>
  //     swap(pool, options.sell?.map(findToken), options.buy?.map(findToken))
  //   ),
}

export const gno = {
  deposit: async ({
    targets,
    tokens,
  }: {
    // "targets" is a mandatory parameter
    targets: (GnoPool["name"] | GnoPool["bpt"] | GnoPool["id"])[]
    tokens?: (GnoToken["address"] | GnoToken["symbol"])[]
  }) => {
    return targets.flatMap((target) =>
      deposit(
        findPool(gnoPools, target),
        tokens?.map((addressOrSymbol) => findToken(gnoPools, addressOrSymbol))
      )
    )
  },
  stake: async (options: {
    targets: (GnoPool["name"] | GnoPool["bpt"] | GnoPool["id"])[]
  }) =>
    options.targets.flatMap((target) =>
      stake(Chain.gno, findPool(gnoPools, target))
    ),
}

export const arb1 = {
  deposit: async ({
    targets,
    tokens,
  }: {
    // "targets" is a mandatory parameter
    targets: (Arb1Pool["name"] | Arb1Pool["bpt"] | Arb1Pool["id"])[]
    tokens?: (Arb1Token["address"] | Arb1Token["symbol"])[]
  }) => {
    return targets.flatMap((target) =>
      deposit(
        findPool(arb1Pools, target),
        tokens?.map((addressOrSymbol) => findToken(arb1Pools, addressOrSymbol))
      )
    )
  },
  stake: async (options: {
    targets: (Arb1Pool["name"] | Arb1Pool["bpt"] | Arb1Pool["id"])[]
  }) =>
    options.targets.flatMap((target) =>
      stake(Chain.arb1, findPool(arb1Pools, target))
    ),
}

export const oeth = {
  deposit: async ({
    targets,
    tokens,
  }: {
    // "targets" is a mandatory parameter
    targets: (OethPool["name"] | OethPool["bpt"] | OethPool["id"])[]
    tokens?: (OethToken["address"] | OethToken["symbol"])[]
  }) => {
    return targets.flatMap((target) =>
      deposit(
        findPool(oethPools, target),
        tokens?.map((addressOrSymbol) => findToken(oethPools, addressOrSymbol))
      )
    )
  },
  stake: async (options: {
    targets: (OethPool["name"] | OethPool["bpt"] | OethPool["id"])[]
  }) =>
    options.targets.flatMap((target) =>
      stake(Chain.oeth, findPool(oethPools, target))
    ),
}

export const base = {
  deposit: async ({
    targets,
    tokens,
  }: {
    // "targets" is a mandatory parameter
    targets: (BasePool["name"] | BasePool["bpt"] | BasePool["id"])[]
    tokens?: (BaseToken["address"] | BaseToken["symbol"])[]
  }) => {
    return targets.flatMap((target) =>
      deposit(
        findPool(basePools, target),
        tokens?.map((addressOrSymbol) => findToken(basePools, addressOrSymbol))
      )
    )
  },
  stake: async (options: {
    targets: (BasePool["name"] | BasePool["bpt"] | BasePool["id"])[]
  }) =>
    options.targets.flatMap((target) =>
      stake(Chain.base, findPool(basePools, target))
    ),
}

