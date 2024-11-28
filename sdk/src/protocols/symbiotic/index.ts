import { allow } from "zodiac-roles-sdk/kit";
import { Chain } from "../../types";
import { EthPool } from "./types";
import { NotFoundError } from "../../errors";

// const WSTETH= "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
// const DEFAULT_COLLATERAL = "0xC329400492c6ff2438472D4651Ad17389fCb843a"

const findPool = (pools: readonly EthPool[], nameOrAddress: string) => {
    const nameOrAddressLower = nameOrAddress.toLowerCase()
    const pool = pools.find(
        (pool) =>
            pool.name.toLowerCase() === nameOrAddressLower ||
            pool.address.toLowerCase() === nameOrAddressLower
    )
    if (!pool) {
        throw new NotFoundError(`Pool not found: ${nameOrAddress}`)
    }
    return pool
}

    //deposit 1st pool
    // allow.mainnet.symbiotic.wstETHPool["deposit(address,uint256)"](),
    // allow.mainnet.lido.stEth.approve(WSTETH),
    // allow.mainnet.lido.wstEth.approve(DEFAULT_COLLATERAL),
    // allow.mainnet.lido.wstEth.wrap(),
