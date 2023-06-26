import { MintPaused } from "../../../errors"
import { allow } from "zodiac-roles-sdk/kit"
import { AVATAR, c, forAll } from "zodiac-roles-sdk"
import { Token, cToken } from "./types"
import { allowErc20Approve } from "../../../erc20"
import { contracts } from "../../../../eth-sdk/config"
import { PresetFunction } from "zodiac-roles-sdk/build/cjs/sdk/src/presets/types"

const _mint2 = (ctoken: cToken): PresetFunction => {
  return {
    ...allow.mainnet.compoundV2.cToken.mint(undefined, { send: true }),
    targetAddress: ctoken,
  }
}

export const _mint = (ctoken: cToken) => ({
  targetAddress: ctoken,
  signature: "mint(uint256)",
  send: true,
})

export const _redeem = (ctoken: cToken[]) =>
  forAll(ctoken, {
    signature: "redeem(uint256)",
    condition: c.matchesAbi([undefined], ["uint256"]),
  })

export const _redeemUnderlying = (ctoken: cToken[]) =>
  forAll(ctoken, {
    signature: "redeemUnderlying(uint256)",
    condition: c.matchesAbi([undefined], ["uint256"]),
  })

export const _borrow = (ctoken: cToken[]) =>
  forAll(ctoken, {
    signature: "borrow(uint256)",
    condition: c.matchesAbi([undefined], ["uint256"]),
  })

export const _repay = (ctoken: cToken[]) =>
  forAll(ctoken, {
    signature: "repayBorrow(uint256)",
    condition: c.matchesAbi([undefined], ["uint256"]),
  })

export const deposit = (token: Token) => {
  const permissions = []
  if (token.mint_paused) {
    throw new MintPaused(`Error: c${token.symbol} paused for minting`)
  } else {
    if (token.symbol != "ETH") {
      permissions.push(allowErc20Approve([token.token], [token.cToken]))
    }
    permissions.push(_mint(token.cToken))
    permissions.push(_redeem([token.cToken]))
    permissions.push(_redeemUnderlying([token.cToken]))
    permissions.push(
      allow.mainnet.compoundV2.comptroller.enterMarkets([token.cToken])
    )
    permissions.push(
      allow.mainnet.compoundV2.comptroller.exitMarket(token.cToken)
    )
    permissions.push(
      allow.mainnet.compoundV2.comptroller["claimComp(address,address[])"](
        AVATAR,
        [token.cToken]
      )
    )

    return permissions
  }
}

export const borrow = (token: Token) => {
  const permissions = []
  if (token.symbol != "ETH") {
    permissions.push(allowErc20Approve([token.token], [token.cToken]))
    permissions.push(_repay([token.cToken]))
  } else {
    permissions.push(allow.mainnet.compoundV2.maximillion.repayBehalf(AVATAR))
  }
  permissions.push(_borrow([token.cToken]))
}
