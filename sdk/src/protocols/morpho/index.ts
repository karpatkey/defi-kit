import { allow } from "zodiac-roles-sdk/kit";
import { Permission } from "zodiac-roles-sdk/.";
import { allowErc20Approve } from "../../conditions";
import { c } from "zodiac-roles-sdk";
import { contracts } from "../../../eth-sdk/config";
import { EthPool } from "./types";
import { NotFoundError } from "../../errors";
// import _ethPools from "./_ethPools";

// Constants for Morpho Protocol
const WETH = contracts.mainnet.weth;
const ETHEREUM_BUNDLER = "0x4095F064B8d3c3548A3bebfd0Bbfd04750E30077"; // EthereumBundlerV2
const METAMORPHO_VAULT = "0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658"; // Replace with the actual vault address

// Utility to find the pool
const findPool = (nameOrAddress: string) => {
    const pool = METAMORPHO_VAULT;
//   const pools = _ethPools;
//   const nameOrAddressLower = nameOrAddress.toLowerCase();
//   const pool = pools.find(
//     (pool) =>
//       pool.name.toLowerCase() === nameOrAddressLower ||
//       pool.address.toLowerCase() === nameOrAddressLower
//   );
//   if (!pool) {
//     throw new NotFoundError(`Pool not found: ${nameOrAddress}`);
//   }
  return pool;
};

export const eth = {
  deposit: async ({
    targets,
  }: {
    targets: (EthPool["name"] | EthPool["address"])[];
  }) => {
    return targets.flatMap((target) => {
      const pool = findPool(target);
      const permissions: Permission[] = [];

      // Approve WETH for Bundler
    //   - **Approve spending of [0,76] WETH for Bundler**
    // - contract: WETH9: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
    // - amount (ETH) 0.0
    // - guy (address): EthereumBundlerV2: 0x4095F064B8d3c3548A3bebfd0Bbfd04750E30077
    // - wad (uni265):  769037620761548058 → gei?
      permissions.push(
        ...allowErc20Approve([WETH], [ETHEREUM_BUNDLER]),
        //approuve 0.76 WETH for the bundler
        {
            ...allow.mainnet.morpho.weth9.approve(
                ETHEREUM_BUNDLER,
                undefined,
                undefined,
            ),
        },

        //appouve - approve WETH9: (the bundle???)
        // - contract: WETH9: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
        // - amount (ETH) 0.0
        // - guy (address): MetaMorpho: (vault [Gauntlet LRT Core (gtLRTcore)](https://etherscan.io/token/0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658) 0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658
        // - wad (uni265):  769037620761548058 → gei?
        {
            ...allow.mainnet.morpho.weth9.approve(
                contracts.mainnet.morpho.metaMorpho,
                undefined,
                undefined,
            ),
            // targetAddress: ?!
        }

        //deposit WETH for vault
        //- deposit:
        // - contract: MetaMorpho = vault: 0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658
        // - amount (ETH) 0.0
        // - **assets** (uint256): 769037620761548058
        // - receiver (address):  0x0EFcCBb9E2C09Ea29551879bd9Da32362b32fc89 → gei
        {
            ...allow.mainnet.morpho.metaMorpho.deposit(
                undefined, //assets
                undefined, //receiver
                undefined, //options
            ),
            targetAddress: METAMORPHO_VAULT,//receiver
        },
        //withdraw WETH from vault
        {
            ...allow.mainnet.morpho.metaMorpho.as
        }

      );

      // Approve WETH for Vault
    //   permissions.push(
    //     allowErc20Approve([WETH], [METAMORPHO_VAULT], c.avatar)
    //   );

      // Deposit WETH into Vault
    //   permissions.push({
    //     ...allow.mainnet.morpho.metaMorpho
    //     [
    //       "deposit(address,uint256)"
    //     ](c.avatar, undefined),
    //     targetAddress: METAMORPHO_VAULT,
    //   });

      // Withdraw WETH from Vault
    //   permissions.push({
    //     ...allow.mainnet.morpho.morphoBlue.withdraw(
    //       c.avatar,
    //       undefined
    //     ),
    //     targetAddress: METAMORPHO_VAULT,
    //   });

      return permissions;
    });
  },
};
