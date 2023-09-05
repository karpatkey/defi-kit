export const getExampleSourceCode = (exampleName: string) => {
  if (exampleName === "apply") {
    return "TODO"
  }

  // default example
  return `// Welcome to the DeFi Kit SDK Playground
// You can use this for exploring the SDK and composing your role permissions.

import { encodeBytes32String } from 'defi-kit'
import { allow, apply, exportJson } from 'defi-kit/gor'

const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'

const ROLES_MOD = '0x74F819Fa1D95B57a15ECDEf9ce5c779C1bD6cc8A'

// Mix and match the permissions you need
const permissions = [
  ...allow.cowswap.swap({buy: [DAI, USDC], sell: [DAI, USDC]})
]

// Apply the permissions to an existing role.
// Calculates the calls for patching the current role configuration to the new permissions.
const roleKey = encodeBytes32String('test-role')
const calls = await apply(roleKey, permissions, {
  address: ROLES_MOD,
  mode: 'extend', // keep the current permissions and add the new ones
  log: console.debug
})

// Log the JSON that can be uploaded to the Safe Transaction Builder app for execution
console.log(exportJson(ROLES_MOD, calls))  
`
}
