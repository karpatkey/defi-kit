import { Permission } from "zodiac-roles-sdk/.";
import { Chain } from "../../types";
import { allow } from "zodiac-roles-sdk/kit";

export const deposit = async (
    options: {
        sell: (`0x${string}` | "ETH" )[]//
        buy?: (`0x${string}` | "ETH" )[]
        feeAmountBp?: number
    },
    chain: Chain
) => {
    const { sell, buy, feeAmountBp } = options
    const permissions: Permission[] = []

    if (sell.length === 0) {
        throw new Error("`sell` must not be an empty array.")
    }
    if (buy && buy.length === 0) {
        throw new Error(
            "`buy` must not be an empty array. Pass `undefined` if you want to allow buying any token."
        )
    }
    if (feeAmountBp !== undefined) {
        if (
            !Number.isInteger(feeAmountBp) ||
            feeAmountBp < 0 ||
            feeAmountBp > 10000
        ) {
            throw new Error("`feeAmountBp` must be an integer between 0 and 10000.")
        }
    }

    // const wrappedNativeToken = getWrappedNativeToken(chain)


    return permissions
}