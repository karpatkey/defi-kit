import { allow } from "zodiac-roles-sdk/kit"
import { Permission } from "zodiac-roles-sdk/."
import { allowErc20Approve } from "../../conditions"
import { c } from "zodiac-roles-sdk"
import { contracts } from "../../../eth-sdk/config"
import { EthPool } from "./types"
import { NotFoundError } from "../../errors"
import _ethPools from "./_ethPools"

const METAMORPHO_VAULT = "0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658" // Replace with the actual vault address
// const ETHEREUM_BUNDLER = "0x4095F064B8d3c3548A3bebfd0Bbfd04750E30077" // EthereumBundlerV2

const findPool = (nameOrAddress: string) => {
  const pools = _ethPools
  const nameOrAddressLower = nameOrAddress.toLowerCase()
  const pool = pools.find(
    (pool) =>
      pool.name.toLowerCase() === nameOrAddressLower ||
      pool.address.toLowerCase() === nameOrAddressLower ||
      pool.symbol.toLowerCase() === nameOrAddressLower
  )
  if (!pool) {
    throw new NotFoundError(`Pool not found: ${nameOrAddress}`)
  }
  return pool
}

export const eth = {
  deposit: async ({
    targets,
  }: {
    targets: (EthPool["symbol"] | EthPool["address"])[]
  }) => {
    return targets.flatMap((target) => {
      const pool = findPool(target)
      const permissions: Permission[] = []

      permissions.push(
        {
          ...allow.mainnet.weth.approve(
            pool.address, //gtLRTcore vault
            undefined,
          ),
          targetAddress: pool.asset.address,
        },
        {
          ...allow.mainnet.morpho.metaMorpho.deposit(
            undefined,
            c.avatar,
          ),
          targetAddress: pool.address,
        },
        {
          ...allow.mainnet.morpho.metaMorpho.mint(
            undefined,
            c.avatar,
          ),
          targetAddress: pool.address,
        },
        {
          ...allow.mainnet.morpho.metaMorpho.withdraw(
            undefined,
            c.avatar,
            c.avatar,
          ),
          targetAddress: pool.address,
        },
        {
          ...allow.mainnet.morpho.metaMorpho.redeem(
            undefined,
            c.avatar,
            c.avatar,
          ),
          targetAddress: pool.address,
        },
      )
      return permissions
    })
  },
}
