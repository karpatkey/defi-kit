import { allow } from "zodiac-roles-sdk/kit"
import { AVATAR, c } from "zodiac-roles-sdk/index"
import { PresetAllowEntry, PresetFunction } from "zodiac-roles-sdk/build/cjs/sdk/src/presets/types"
import { Comet, Token } from "./types"
import { allowErc20Approve } from "../../../erc20"
import { contracts } from "../../../../eth-sdk/config"

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
const ACTION_SUPPLY_NATIVE_TOKEN =
  "0x414354494f4e5f535550504c595f4e41544956455f544f4b454e000000000000"
const ACTION_WITHDRAW_NATIVE_TOKEN =
  "0x414354494f4e5f57495448445241575f4e41544956455f544f4b454e00000000"
// const ACTION_SUPPLY_ASSET = "0x414354494f4e5f535550504c595f415353455400000000000000000000000000"
// const ACTION_WITHDRAW_ASSET = "0x414354494f4e5f57495448445241575f41535345540000000000000000000000"
// const ACTION_CLAIM_REWARD = "0x414354494f4e5f434c41494d5f52455741524400000000000000000000000000"

const _allow = (token: Comet): PresetFunction => {
  return {
    // IMPORTANT: the allow() function was added to the comet abi, using the cUSDCv3 Ext (0x285617313887d43256F852cAE0Ee4de4b68D45B0) abi
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
  const erc20Tokens = tokens.filter(token => token.symbol !== 'ETH')
  const erc20TokenAddresses = erc20Tokens.map(token => token.address)

  const permissions = [
    // allow allowing the bulker
    _allow(comet),

    // allow approvals for all deposit tokens to the comet
    ...allowErc20Approve(
      erc20TokenAddresses,
      [comet.address]
    ),


    // allow supply and withdraw of ERC-20 tokens
    {...allow.mainnet.compoundV3.comet.supply(c.or(...(erc20TokenAddresses as [string, string, ...string[]]))), targetAddress: comet.address},
    {...allow.mainnet.compoundV3.comet.withdraw(c.or(...(erc20TokenAddresses as [string, string, ...string[]]))), targetAddress: comet.address},
  ]

  if(tokens.some(token => token.symbol === 'ETH')) {
    // allow supply and withdraw of ETH through the bulker contract
    permissions.push(
      allow.mainnet.compoundV3.MainnetBulker.invoke(
        [ACTION_SUPPLY_NATIVE_TOKEN],
        c.matches([
          c.abiEncodedMatches(
            [comet.address, AVATAR],
            ["address", "address", "uint256"]
          ),
        ]),
        { send: true }
      ),

      allow.mainnet.compoundV3.MainnetBulker.invoke(
        [ACTION_WITHDRAW_NATIVE_TOKEN],
        c.matches([
          c.abiEncodedMatches(
            [comet.address, AVATAR],
            ["address", "address", "uint256"]
          ),
        ])
      )
    )
  }

  return permissions
}

export const borrow = (comet: Comet) => {
  const permissions: PresetAllowEntry[] = [
    {...allow.mainnet.compoundV3.comet.supply(comet.borrowToken.address), targetAddress: comet.address},
    {...allow.mainnet.compoundV3.comet.withdraw(comet.borrowToken.address), targetAddress: comet.address},
    // Other option to avoid the if(comet.borrowToken.symbol !== 'ETH')
    // ...(comet.borrowToken.symbol !== 'ETH' ? allowErc20Approve([comet.borrowToken.address], [comet.address]) : []),
  ]
  
  if(comet.borrowToken.symbol !== 'ETH') {
    permissions.push(
      ...allowErc20Approve([comet.borrowToken.address], [comet.address])
    )
  }

}

export const claim = (comet: Comet) => {
  return [allow.mainnet.compoundV3.CometRewards.claim(
    comet.address,
    AVATAR
  )]
}