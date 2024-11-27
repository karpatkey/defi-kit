import { allow } from "zodiac-roles-sdk/kit";

export const eth = {
  deposit: async () => [
    allow.mainnet.symbiotic.wstETHPool["deposit(address,uint256)"](),
  ],
} 