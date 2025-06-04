import { allow } from "zodiac-roles-sdk/kit"
import { MarketParams, Vault } from "./types"
import { c } from "zodiac-roles-sdk"
import { contracts } from "../../../eth-sdk/config"

export function withdraw(vault: Vault) {
  return [
    {
      ...allow.mainnet.morpho.metaMorpho.withdraw(
        undefined,
        c.avatar,
        c.avatar
      ),
      targetAddress: vault.address,
    },
    {
      ...allow.mainnet.morpho.metaMorpho.redeem(undefined, c.avatar, c.avatar),
      targetAddress: vault.address,
    },
  ]
}

export function deposit(vault: Vault) {
  return [
    {
      ...allow.mainnet.weth.approve(vault.address, undefined),
      targetAddress: vault.asset.address,
    },
    {
      ...allow.mainnet.morpho.metaMorpho.deposit(undefined, c.avatar),
      targetAddress: vault.address,
    },
    {
      ...allow.mainnet.morpho.metaMorpho.mint(undefined, c.avatar),
      targetAddress: vault.address,
    },
  ]
}

export function manageCollateral(marketParams: MarketParams) {
  return [
    {
      ...allow.mainnet.weth.approve(
        contracts.mainnet.morpho.morphoBlue,
        undefined
      ),
      targetAddress: marketParams.collateralToken,
    },
    {
      ...allow.mainnet.morpho.morphoBlue.supplyCollateral(
        undefined,
        undefined,
        c.avatar,
        "0x"
      ),
    },
    {
      ...allow.mainnet.morpho.morphoBlue.withdrawCollateral(
        undefined,
        undefined,
        c.avatar,
        c.avatar
      ),
    },
  ]
}

export function manageLoan(marketParams: MarketParams) {
  return [
    {
      ...allow.mainnet.lido.wstEth.approve(
        contracts.mainnet.morpho.morphoBlue,
        undefined
      ),

      targetAddress: marketParams.loanToken,
    },
    {
      ...allow.mainnet.morpho.morphoBlue.borrow(
        c.matches({
          loanToken: marketParams.loanToken,
          collateralToken: marketParams.collateralToken,
          oracle: marketParams.oracle,
          irm: marketParams.irm,
          lltv: marketParams.lltv,
        }),
        undefined,
        undefined,
        c.avatar,
        c.avatar
      ),
    },
    {
      ...allow.mainnet.morpho.morphoBlue.repay(
        c.matches({
          loanToken: marketParams.loanToken,
          collateralToken: marketParams.collateralToken,
          oracle: marketParams.oracle,
          irm: marketParams.irm,
          lltv: marketParams.lltv,
        }),
        undefined,
        undefined,
        c.avatar,
        "0x"
      ),
    },
  ]
}

export function manageSupply(marketParams: MarketParams) {
  return [
    {
      ...allow.mainnet.weth.approve(
        contracts.mainnet.morpho.morphoBlue,
        undefined
      ),
      targetAddress: marketParams.loanToken,
    },
    {
      ...allow.mainnet.morpho.morphoBlue.supply(
        c.matches({
          loanToken: marketParams.loanToken,
          collateralToken: marketParams.collateralToken,
          oracle: marketParams.oracle,
          irm: marketParams.irm,
          lltv: marketParams.lltv,
        }),
        undefined,
        undefined,
        c.avatar,
        "0x"
      ),
    },
    {
      ...allow.mainnet.morpho.morphoBlue.withdraw(
        c.matches({
          loanToken: marketParams.loanToken,
          collateralToken: marketParams.collateralToken,
          oracle: marketParams.oracle,
          irm: marketParams.irm,
          lltv: marketParams.lltv,
        }),
        undefined,
        undefined,
        c.avatar,
        c.avatar
      ),
    },
  ]
}
