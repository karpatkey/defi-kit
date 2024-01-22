import { MintPaused } from "../../../errors"
import { allow } from "zodiac-roles-sdk/kit"
import { c, Permission } from "zodiac-roles-sdk"
import { Token, cToken } from "./types"
import { allowErc20Approve } from "../../../conditions"

const _mint = (token: Token): Permission[] => {
  const permissions = []

  if (token.symbol === "ETH") {
    permissions.push(
      allow.mainnet.compoundV2.cETH.mint({
        send: true,
      })
    )
  } else {
    permissions.push({
      ...allow.mainnet.compoundV2.cToken.mint(undefined),
      targetAddress: token.cToken,
    })
  }

  return permissions
}

// it is called when MAX underlying amount is withdrawn
const _redeem = (ctoken: cToken): Permission => {
  return {
    ...allow.mainnet.compoundV2.cToken.redeem(),
    targetAddress: ctoken,
  }
}

// it is called when MAX underlying amount is NOT withdrawn
const _redeemUnderlying = (ctoken: cToken): Permission => {
  return {
    ...allow.mainnet.compoundV2.cToken.redeemUnderlying(),
    targetAddress: ctoken,
  }
}

const _borrow = (ctoken: cToken): Permission => {
  return {
    ...allow.mainnet.compoundV2.cToken.borrow(),
    targetAddress: ctoken,
  }
}

const _repay = (token: Token): Permission[] => {
  const permissions = []

  if (token.symbol === "ETH") {
    permissions.push(
      allow.mainnet.compoundV2.maximillion.repayBehalf(c.avatar, {
        send: true,
      })
    )
  } else {
    permissions.push({
      ...allow.mainnet.compoundV2.cToken.repayBorrow(),
      targetAddress: token.cToken,
    })
  }

  return permissions
}

export const deposit = (token: Token) => {
  const permissions: Permission[] = []
  if (token.mint_paused) {
    throw new MintPaused(`Error: c${token.symbol} paused for minting`)
  } else {
    if (token.symbol != "ETH") {
      permissions.push(...allowErc20Approve([token.token], [token.cToken]))
    }
    permissions.push(..._mint(token))
    permissions.push(_redeem(token.cToken))
    permissions.push(_redeemUnderlying(token.cToken))
    permissions.push(
      allow.mainnet.compoundV2.comptroller.enterMarkets([token.cToken])
    )
    permissions.push(
      allow.mainnet.compoundV2.comptroller.exitMarket(token.cToken)
    )
    permissions.push(
      allow.mainnet.compoundV2.comptroller["claimComp(address,address[])"](
        c.avatar
      )
    )

    return permissions
  }
}

export const borrow = (token: Token) => {
  const permissions: Permission[] = []
  if (token.symbol != "ETH") {
    permissions.push(...allowErc20Approve([token.token], [token.cToken]))
  }

  permissions.push(..._repay(token))
  permissions.push(_borrow(token.cToken))

  return permissions
}
