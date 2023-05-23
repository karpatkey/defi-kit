export const getExampleSourceCode = (exampleName: string) => {
  if (exampleName === "apply") {
    return "TODO"
  }

  // default example
  return `// Welcome to the DeFi Presets SDK Playground
// You can use this for exploring the SDK and composing your role permissions.

import { allow, apply, encodeBytes32String } from 'defi-presets/mainnet'

// Mix and match the permissions you need
const permissions = [
  ...allow.curve
]

// Apply the permissions to a role
const roleKey = encodeBytes32String('my-role')
const calls = apply(roleKey, permissions, { currentPermissions: [], mode: 'extend', log: console.debug })

// Log the calls for updating the configuration of the Roles mod
console.log(calls)
`
}
