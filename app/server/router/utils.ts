import { encodeBytes32String } from "defi-presets"
import { arrayify } from "ethers/lib/utils"

export const parseInputs = (inputs: { mod: string; role: string }) => {
  // const [chainPrefix, address] = inputs.mod.split(":")
  // const network = NETWORKS[chainPrefix as keyof typeof NETWORKS] // this is safe since already checked by the regex

  let roleKey: string | undefined = undefined
  try {
    roleKey = encodeBytes32String(inputs.role)
  } catch (e) {
    // string is too long to be encoded as bytes32, check if it's a bytes32 already
    const data = arrayify(inputs.role)
    if (data.length === 32 && data[31] === 0) {
      roleKey = inputs.role
    }
  }
  if (!roleKey) {
    throw new Error(`Invalid role key: ${inputs.role}`)
  }

  return {
    roleKey,
    modAddress: inputs.mod as `0x${string}`,
  }
}
