import { allow } from "zodiac-roles-sdk/kit";
import { Chain } from "../../types";

const WSTETH= "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
const DEFAULT_COLLATERAL = "0xC329400492c6ff2438472D4651Ad17389fCb843a"

export const eth = {
  deposit: async () => [
    //deposit 1st pool
    allow.mainnet.symbiotic.wstETHPool["deposit(address,uint256)"](),
    allow.mainnet.lido.stEth.approve(WSTETH),
    allow.mainnet.lido.wstEth.approve(DEFAULT_COLLATERAL),
    allow.mainnet.lido.wstEth.wrap(),
  ],
} 