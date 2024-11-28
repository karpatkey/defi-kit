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

export const eth = {
    deposit: async ({
        targets,
    }: {
        targets: (EthPool["name"] | EthPool["address"])[]
    }) => {
        const permissions = await Promise.all(
            targets.map((target) =>
                //allow deposit to the target pool
                (allow.mainnet.symbiotic[target as keyof typeof allow.mainnet.symbiotic]["deposit(address,uint256)"] as any)()
                //allow approve to the target pool
                .concat((allow.mainnet.lido.stEth.approve as any)(findPool(ethPools, target)?.address))
            )
        )
        return permissions
    },

    //deposit 1st pool
    // allow.mainnet.symbiotic.${POOL}["deposit(address,uint256)"](), //deposit
    //If you don't have enough wstETH, your stETH will be wrapped automatically.
    // allow.mainnet.lido.stEth.approve(${POOL}), // allow stETH to wrap
    // allow.mainnet.lido.wstEth.approve(DEFAULT_COLLATERAL), //approve
    // allow.mainnet.lido.wstEth.wrap(), //wrap
