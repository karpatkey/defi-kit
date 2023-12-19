import { allow } from "zodiac-roles-sdk/kit"
import { c } from "zodiac-roles-sdk"
import { Permission } from "zodiac-roles-sdk"
import { Comet, Token } from "./types"
import { allowErc20Approve } from "../../../erc20"
import { contracts } from "../../../../eth-sdk/config"

// abi = (address comet, address to, uint amount)
const ACTION_SUPPLY_NATIVE_TOKEN =
  "0x414354494f4e5f535550504c595f4e41544956455f544f4b454e000000000000"
// abi = (address comet, address to, uint amount)
const ACTION_WITHDRAW_NATIVE_TOKEN =
  "0x414354494f4e5f57495448445241575f4e41544956455f544f4b454e00000000"
// abi = (address comet, address to, address asset, uint amount)
const ACTION_SUPPLY_ASSET =
  "0x414354494f4e5f535550504c595f415353455400000000000000000000000000"
// abi = (address comet, address to, address asset, uint amount)
const ACTION_WITHDRAW_ASSET =
  "0x414354494f4e5f57495448445241575f41535345540000000000000000000000"
// abi = (address comet, address rewards, address src, bool shouldAccrue)
const ACTION_CLAIM_REWARD =
  "0x414354494f4e5f434c41494d5f52455741524400000000000000000000000000"

const _allow = (token: Comet): Permission => {
  return {
    // IMPORTANT: the Comet implementation does not have the allow function, but if you take a look to the fallback() function
    // https://etherscan.io/address/0x7a1316220a46dce22fd5c6d55a39513367e6c967#code#F1#L1314
    // function extensionDelegate() virtual external view returns (address) -> Read function
    // The extensionDelegate() function retrieves the CometExt address = 0xe2C1F54aFF6b38fD9DF7a69F22cB5fd3ba09F030
    // which has the allow() function in it. Or using the cUSDCv3 Ext (0x285617313887d43256F852cAE0Ee4de4b68D45B0) abi
    ...allow.mainnet.compoundV3.comet.allow(
      contracts.mainnet.compoundV3.MainnetBulker
    ),
    targetAddress: token.address,
  }
}

export const deposit = (
  comet: Comet,
  tokens: Token[] = [comet.borrowToken, ...comet.collateralTokens]
) => {
  const erc20Tokens = tokens.filter((token) => token.symbol !== "ETH")
  const erc20TokenAddresses = erc20Tokens.map((token) => token.address)

  const permissions = [
    // allow allowing the bulker
    _allow(comet),

    // allow approvals for all deposit tokens to the comet
    ...allowErc20Approve(erc20TokenAddresses, [comet.address]),

    // allow supply and withdraw of ERC-20 tokens
    {
      ...allow.mainnet.compoundV3.comet.supply(
        c.or(...(erc20TokenAddresses as [string, string, ...string[]]))
      ),
      targetAddress: comet.address,
    },
    {
      ...allow.mainnet.compoundV3.comet.withdraw(
        c.or(...(erc20TokenAddresses as [string, string, ...string[]]))
      ),
      targetAddress: comet.address,
    },

    allow.mainnet.compoundV3.MainnetBulker.invoke(
      c.every(
        c.or(
          c.eq(ACTION_SUPPLY_ASSET),
          c.eq(ACTION_WITHDRAW_ASSET),
          c.eq(ACTION_CLAIM_REWARD)
        )
      ),
      c.every(
        c.or(
          c.abiEncodedMatches(
            [
              comet.address,
              c.avatar,
              c.or(...(erc20TokenAddresses as [string, string, ...string[]]))
            ],
            ["address", "address", "address", "uint256"]
          ),

          c.abiEncodedMatches(
            [
              comet.address,
              contracts.mainnet.compoundV3.CometRewards,
              c.avatar,
            ],
            ["address", "address", "address", "bool"]
          ),
        )
      ),
      // Roles mod does not support scoping the same function with different option values.
      { send: true }
    )
  ]

  if (tokens.some((token) => token.symbol === "ETH")) {
    // allow supply and withdraw of ETH through the bulker contract
    permissions.push(
      allow.mainnet.compoundV3.MainnetBulker.invoke(
        c.every(
          c.or(
            c.eq(ACTION_SUPPLY_NATIVE_TOKEN),
            c.eq(ACTION_WITHDRAW_NATIVE_TOKEN),
            c.eq(ACTION_CLAIM_REWARD)
          )
        ),
        c.every(
          c.or(
            c.abiEncodedMatches(
              [comet.address, c.avatar],
              ["address", "address", "uint256"]
            ),
            c.abiEncodedMatches(
              [
                comet.address,
                contracts.mainnet.compoundV3.CometRewards,
                c.avatar,
              ],
              ["address", "address", "address", "bool"]
            ),
          )
        ),
        // Roles mod does not support scoping the same function with different option values.
        // So we must also allow send here. This is not a problem because the MainnetBulker contract
        // will refund any sent but unused ETH.
        { send: true }
      )
    )
  }

  permissions.push(
    allow.mainnet.compoundV3.CometRewards.claim(comet.address, c.avatar)
  )

  return permissions
}

export const borrow = (comet: Comet) => {
  const permissions: Permission[] = []

  // Other option to avoid the if(comet.borrowToken.symbol !== 'ETH')
  // ...(comet.borrowToken.symbol !== 'ETH' ? allowErc20Approve([comet.borrowToken.address], [comet.address]) : []),

  if (comet.borrowToken.symbol !== "ETH") {
    permissions.push(
      ...allowErc20Approve([comet.borrowToken.address], [comet.address]),

      {
        ...allow.mainnet.compoundV3.comet.supply(comet.borrowToken.address),
        targetAddress: comet.address,
      },

      {
        ...allow.mainnet.compoundV3.comet.withdraw(comet.borrowToken.address),
        targetAddress: comet.address,
      },

      allow.mainnet.compoundV3.MainnetBulker.invoke(
        c.every(
          c.or(
            c.eq(ACTION_SUPPLY_ASSET),
            c.eq(ACTION_WITHDRAW_ASSET)
          )
        ),
        c.every(
          c.abiEncodedMatches(
            [
              comet.address,
              c.avatar,
              comet.borrowToken.address
            ],
            ["address", "address", "address", "uint256"]
          ),
        ),
        // Roles mod does not support scoping the same function with different option values.
        { send: true }
      )
    )
  } else {
    permissions.push(
      allow.mainnet.compoundV3.MainnetBulker.invoke(
        c.every(
          c.or(
            c.eq(ACTION_SUPPLY_NATIVE_TOKEN),
            c.eq(ACTION_WITHDRAW_NATIVE_TOKEN)
          )
        ),
        c.every(
          c.abiEncodedMatches(
            [comet.address, c.avatar],
            ["address", "address", "uint256"]
          ),
        ),
        // Roles mod does not support scoping the same function with different option values.
        { send: true }
      ),
    )
  }

  return permissions
}

// export const claim = (comet: Comet) => {
//   return [allow.mainnet.compoundV3.CometRewards.claim(comet.address, c.avatar)]
// }
