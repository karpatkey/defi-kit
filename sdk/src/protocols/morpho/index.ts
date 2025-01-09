import { allow } from "zodiac-roles-sdk/kit"
import { Permission } from "zodiac-roles-sdk/."
import { allowErc20Approve } from "../../conditions"
import { c } from "zodiac-roles-sdk"
import { contracts } from "../../../eth-sdk/config"
import { EthPool } from "./types"
import { NotFoundError } from "../../errors"
import _ethPools from "./_ethPools"

// Constants for Morpho Protocol
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" //underlying asset
const METAMORPHO_VAULT = "0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658" // Replace with the actual vault address

const ETHEREUM_BUNDLER = "0x4095F064B8d3c3548A3bebfd0Bbfd04750E30077" // EthereumBundlerV2

//VAULT EXEMPLE: gtLRTcore
// asset: {
//   address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
//   symbol: "WETH",
// },
// address: "0x4881ef0bf6d2365d3dd6499ccd7532bcdbce0658",
// name: "Gauntlet LRT Core",
// symbol: "gtLRTcore",

// Utility to find the pool
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

      // Approve WETH for Bundler
      //   - **Approve spending of [0,76] WETH for Bundler**
      // - contract: WETH9: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
      // - amount (ETH) 0.0
      // - guy (address): EthereumBundlerV2: 0x4095F064B8d3c3548A3bebfd0Bbfd04750E30077
      // - wad (uni265):  769037620761548058 → gei?
      permissions.push(
        ...allowErc20Approve([WETH], [ETHEREUM_BUNDLER]),
        //Step 1: approuve 0.76 WETH for the bundler
        {
          ...allow.mainnet.morpho.weth9.approve(
            ETHEREUM_BUNDLER,
            undefined,
            undefined
          ),
        },

        //Step 2: appouve - approve WETH9 metaMorpho
        // - contract: WETH9: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
        // - amount (ETH) 0.0
        // - guy (address): MetaMorpho address: (vault [Gauntlet LRT Core (gtLRTcore)](https://etherscan.io/token/0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658) 0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658
        // - wad (uni265):  769037620761548058 → gei?
        {
          ...allow.mainnet.morpho.weth9.approve(
            METAMORPHO_VAULT, //gtLRTcore vault
            undefined,
          ),
          targetAddress: pool.address,
        },
        // Step 3: deposit WETH for vault
        // - deposit:
        // - contract: MetaMorpho = vault: 0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658
        // - amount (ETH) 0.0
        // - **assets** (uint256): 769037620761548058 → gei
        // - receiver (address):  0x0EFcCBb9E2C09Ea29551879bd9Da32362b32fc89
        {
          ...allow.mainnet.morpho.metaMorpho.deposit(
            undefined,
            c.avatar,
          ),
          targetAddress: METAMORPHO_VAULT, //receiver
        },
        //Step 4: withdraw WETH from vault ??? When?
        // {
        //   ...allow.mainnet.morpho.metaMorpho.as,
        // }
      )

      return permissions
    })
  },
}
