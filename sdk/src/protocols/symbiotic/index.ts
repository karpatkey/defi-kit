import { allow } from "zodiac-roles-sdk/kit";
import { EthPool } from "./types";
import { NotFoundError } from "../../errors";
import _ethPools from "./_ethPools";
import { Permission } from "zodiac-roles-sdk/.";
import { allowErc20Approve } from "../../conditions";

const WSTETH = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0";

const findPoolSym = (nameOrAddress: string) => {
    const pools = _ethPools;
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
        type SymbioticKeys = keyof typeof allow.mainnet.symbiotic;
        const permissions: Permission[] = []
        targets.flatMap((target) => {
            const pool = findPoolSym(target);
            return [
                ...allowErc20Approve([pool.token.address], [pool.address]),
                {
                    // Approve target: allow target to wrap if needed
                    ...allow.mainnet.lido.stEth.approve(WSTETH),
                    targetAddress: pool.token.address,
                },
                {
                    // Wrap stEth if not already wrapped
                    ...allow.mainnet.lido.wstEth.wrap(),
                    targetAddress: pool.address,
                },
                {
                    // Grant permissions: allow symbiotic to stake your wrapped token
                    ...allow.mainnet.lido.wstEth.approve(pool.address),//default collateral
                    targetAddress: pool.address,
                },
                {
                    // Finalize deposit: complete the restaking process
                    ...allow.mainnet.symbiotic[pool.name as SymbioticKeys]["deposit(address,uint256)"]()
                },
            ];
        })
        return permissions
    },


    // Approve stETH: allow stETH to wrap
    //  allow.mainnet.lido.stETH.approve(WSTETH),
    // const WSTETH= "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"


    // Wrap stETH
    // allow.mainnet.lido.wstETH.wrap(),

    // Grant permissions: allow symbitoc to stake your wstETH
    // allow.mainnet.lido.wstEth.approve(DEFAULT_COLLATERAL),
    // const DEFAULT_COLLATERAL = "0xC329400492c6ff2438472D4651Ad17389fCb843a"

    // Finalize deposit: complete the restaking process 
    //allow.mainnet.symbiotic.DefaultCollateral["deposit(address,uint256)"](),

