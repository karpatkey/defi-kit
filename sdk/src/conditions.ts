import { BytesLike, ParamType, keccak256, toUtf8Bytes } from "ethers/lib/utils"
import { ConditionFunction } from "zodiac-roles-sdk/build/cjs/sdk/src/presets/authoring/conditions/types"
import { PresetFunction } from "zodiac-roles-sdk/build/cjs/sdk/src/presets/types"
import { Operator, ParameterType, c } from "zodiac-roles-sdk"
import { PresetCondition } from "zodiac-roles-sdk/build/cjs/sdk/src/presets/types"

type MatchesAbiConditionFunction = () => PresetCondition

/**
 * Matches a bytes value that is encoded like transaction data (4 bytes selector followed by ABI encoded parameters) against the given preset function.
 *
 * Checks that the first 4 bytes of the value match the selector of the preset function, and that the remaining bytes satisfy the condition of the preset function.
 **/
export const matchesCalldata =
  (presetFunction: PresetFunction) =>
  (abiType: ParamType): ConditionFunction<BytesLike> => {
    if (abiType.type !== "bytes") {
      throw new Error("matchesCalldata is only applicable to bytes values")
    }

    const { selector, condition } = coercePresetFunction(presetFunction)
    if (condition) {
      if (
        condition.operator !== Operator.Matches ||
        condition.paramType !== ParameterType.AbiEncoded
      ) {
        throw new Error(
          "matchesCalldata expects a preset function with a Matches AbiEncoded condition"
        )
      }
    }

    // TODO implement in zodiac-roles-sdk
    const selectorCondition = c.bitmask({
      mask: "0xffffffff0000000000000000000000",
      selector,
    })

    return condition
      ? c.and(selectorCondition, () => condition)
      : selectorCondition
  }

const sighash = (signature: string): string =>
  keccak256(toUtf8Bytes(signature)).substring(0, 10)

const coercePresetFunction = (entry: PresetFunction) => {
  return {
    targetAddress: entry.targetAddress.toLowerCase(),
    selector:
      "selector" in entry
        ? entry.selector.toLowerCase()
        : sighash(entry.signature),
    condition:
      typeof entry.condition === "function"
        ? entry.condition(ParamType.from("bytes"))
        : entry.condition,
    send: entry.send,
    delegatecall: entry.delegatecall,
  }
}
