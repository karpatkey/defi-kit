import { allow } from "zodiac-roles-sdk/kit";
import { EthPool } from "./types";
import { NotFoundError } from "../../errors";
import _ethPools from "./_ethPools";
import { Permission } from "zodiac-roles-sdk/.";
import { allowErc20Approve } from "../../conditions";

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
                    // Approve target: allow target to wrap
                    ...allow.mainnet.lido.stEth.approve(pool.address),
                    targetAddress: pool.address,
                },
                {
                    // Wrap stEth if not already wrapped
                    ...allow.mainnet.lido.wstEth.wrap(),
                    targetAddress: pool.address,
                },
                {
                    // Grant permissions: allow symbiotic to stake your wrapped token
                    ...allow.mainnet.lido.wstEth.approve(pool.token.address),
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
    // allow.mainnet.lido.stEth.approve(${POOL})

    // Wrap stETH
    // allow.mainnet.lido.wstEth.wrap(),

    // Grant permissions: allow symbitoc to stake your wstETH
    // allow.mainnet.lido.wstEth.approve(DEFAULT_COLLATERAL),

    // Finalize deposit: complete the restaking process
    // allow.mainnet.symbiotic.${POOL}["deposit(address,uint256)"]()
