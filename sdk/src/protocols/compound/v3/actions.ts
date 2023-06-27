import { allow } from "zodiac-roles-sdk/kit"
import { AVATAR, c } from "zodiac-roles-sdk/index"
import { PresetFunction } from "zodiac-roles-sdk/build/cjs/sdk/src/presets/types"
import { Comet } from "./types"
import { allowErc20Approve } from "../../../erc20"
import { contracts } from "../../../../eth-sdk/config"

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
const ACTION_SUPPLY_NATIVE_TOKEN = "0x414354494f4e5f535550504c595f4e41544956455f544f4b454e000000000000"
const ACTION_WITHDRAW_NATIVE_TOKEN = "0x414354494f4e5f57495448445241575f4e41544956455f544f4b454e00000000"
// const ACTION_SUPPLY_ASSET = "0x414354494f4e5f535550504c595f415353455400000000000000000000000000"
// const ACTION_WITHDRAW_ASSET = "0x414354494f4e5f57495448445241575f41535345540000000000000000000000"
// const ACTION_CLAIM_REWARD = "0x414354494f4e5f434c41494d5f52455741524400000000000000000000000000"

const _allow = (token: Comet): PresetFunction => {
  return {
    // IMPORTANT: the allow() function was added to the cUSDCv3 abi, using the cUSDCv3 Ext (0x285617313887d43256F852cAE0Ee4de4b68D45B0) abi
    ...allow.mainnet.compoundV3.comet.allow(contracts.mainnet.compoundV3.MainnetBulker),
    targetAddress: token.address,
  }
}

export const deposit = (token: Comet) => {
  const permissions = []
  permissions.push(
    _allow(token)
  )
  if (token.symbol != "ETH") {
    permissions.push(allowErc20Approve([token.token], [contracts.mainnet.compoundV3.cUSDCv3]))
    permissions.push(
      allow.mainnet.compoundV3.cUSDCv3.supply(token.token)
    )
    // allow.mainnet.compoundV3.MainnetBulker.invoke(
    //   [ACTION_SUPPLY_ASSET],
    //   [contracts.mainnet.compoundV3.cUSDCv3, AVATAR, token.token],
    // )
    permissions.push(
      allow.mainnet.compoundV3.cUSDCv3.withdraw(token.token)
    )
    // allow.mainnet.compoundV3.MainnetBulker.invoke(
    //   [ACTION_WITHDRAW_ASSET],
    //   [contracts.mainnet.compoundV3.cUSDCv3, AVATAR, token.token],
    // )

  } else {
    permissions.push(
      allow.mainnet.compoundV3.MainnetBulker.invoke(
        [ACTION_SUPPLY_NATIVE_TOKEN],
        c.matches([
          c.matchesAbi([contracts.mainnet.compoundV3.cUSDCv3, AVATAR], ['address', 'address', 'uint256']),
        ]),
        {send:true}
      )
    )
    permissions.push(
      allow.mainnet.compoundV3.MainnetBulker.invoke(
        [ACTION_WITHDRAW_NATIVE_TOKEN],
        c.matches([
          c.matchesAbi([contracts.mainnet.compoundV3.cUSDCv3, AVATAR], ['address', 'address', 'uint256']),
        ]),
      )
    )
  }
  permissions.push(
    allow.mainnet.compoundV3.CometRewards.claim(
      contracts.mainnet.compoundV3.cUSDCv3,
      AVATAR
    )
  )
  // permissions.push(
  //   allow.mainnet.compoundV3.MainnetBulker.invoke(
  //     [ACTION_CLAIM_REWARD],
  //     [contracts.mainnet.compoundV3.cUSDCv3, contracts.mainnet.compoundV3.CometRewards, AVATAR]
  //   )
  // )
  
  return permissions
}

export const borrow = () => {
  return [
    allowErc20Approve([USDC], [contracts.mainnet.compoundV3.cUSDCv3]),
    allow.mainnet.compoundV3.cUSDCv3.supply(
      USDC
    ),
    // allow.mainnet.compoundV3.MainnetBulker.invoke(
    //   [ACTION_SUPPLY_ASSET],
    //   [contracts.mainnet.compoundV3.cUSDCv3, AVATAR, USDC],
    // ),
    allow.mainnet.compoundV3.cUSDCv3.withdraw(
      USDC
    ),
    // allow.mainnet.compoundV3.MainnetBulker.invoke(
    //   [ACTION_WITHDRAW_ASSET],
    //   [contracts.mainnet.compoundV3.cUSDCv3, AVATAR, USDC],
    // )
  ]
}
