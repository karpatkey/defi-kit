export const getExampleSourceCode = (exampleName: string) => {
  if (exampleName === "apply") {
    return "TODO"
  }

  // default example
  return `// Welcome to the DeFi Kit SDK Playground
// You can use this for exploring the SDK and composing your role permissions.

import { encodeBytes32String } from 'defi-kit'
import { allow, apply, exportToSafeTransactionBuilder } from 'defi-kit/gno'

const EURE = '0xcB444e90D8198415266c6a2724b7900fb12FC56E'
const USDC = '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83'

const ROLES_MOD = '0x39B37934Bf81d87683984961266dD27385bC3f9a'

// Mix and match the permissions you need
const permissions = [
  allow.cowswap.swap({buy: [EURE, USDC], sell: [EURE, USDC]})
]

// Apply the permissions to a role.
// Calculates the calls for patching the current role configuration to the new permissions.
const roleKey = encodeBytes32String('test-role')
const calls = await apply(roleKey, permissions, {
  address: ROLES_MOD,
  mode: 'extend', // keep the current permissions and add the new ones
  log: console.debug
})

// Log the JSON that can be uploaded to the Safe Transaction Builder app for execution
console.log(exportToSafeTransactionBuilder(calls))
`
}
