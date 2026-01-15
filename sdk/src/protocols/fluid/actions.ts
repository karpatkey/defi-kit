import { allow } from "zodiac-roles-sdk/kit"
import { c, Permission } from "zodiac-roles-sdk"
import { Token } from "./types"
import { allowErc20Approve } from "../../conditions"
import { contracts } from "../../../eth-sdk/config"
import { Chain } from "../../types"

export const _getAllAddresses = (chain: Chain) => {
  if (chain === Chain.eth) {
    return {
      fNativeToken: contracts.mainnet.fluid.fWeth as `0x${string}`,
    }
  } else if (chain === Chain.arb1) {
    return {
      fNativeToken: contracts.arbitrumOne.fluid.fWeth as `0x${string}`,
    }
  } else if (chain === Chain.base) {
    return {
      fNativeToken: contracts.base.fluid.fWeth as `0x${string}`,
    }
  } else {
    throw new Error(`Unsupported chain: ${chain}`)
  }
}

export const depositEther = (chain: Chain): Permission[] => {
  const { fNativeToken } = _getAllAddresses(chain)

  return [
    {
      ...allow.mainnet.fluid.fWeth["depositNative(address)"](c.avatar, {
        send: true,
      }),
      targetAddress: fNativeToken,
    },
    {
      ...allow.mainnet.fluid.fWeth["withdrawNative(uint256,address,address)"](
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: fNativeToken,
    },
    {
      ...allow.mainnet.fluid.fWeth["redeemNative(uint256,address,address)"](
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: fNativeToken,
    },
  ]
}

export const depositToken = (token: Token): Permission[] => {
  return [
    ...allowErc20Approve([token.token], [token.fToken]),
    {
      ...allow.mainnet.fluid.fWeth["deposit(uint256,address)"](
        undefined,
        c.avatar
      ),
      targetAddress: token.fToken,
    },
    {
      ...allow.mainnet.fluid.fWeth["withdraw(uint256,address,address)"](
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: token.fToken,
    },
    {
      ...allow.mainnet.fluid.fWeth["redeem(uint256,address,address)"](
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: token.fToken,
    },
  ]
}
