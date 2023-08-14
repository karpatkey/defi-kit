export const getExampleSourceCode = (exampleName: string) => {
  if (exampleName === "apply") {
    return "TODO"
  }

  // default example
  return `// Welcome to the DeFi Presets SDK Playground
// You can use this for exploring the SDK and composing your role permissions.

import { encodeBytes32String } from 'defi-kit'
import { allow, apply } from 'defi-kit/eth'

const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'

// Mix and match the permissions you need
const permissions = [
  ...allow.curve.deposit({ targets: ['DAI/USDC/USDT', 'DAI/USDC/USDT/sUSD'] }),
  ...allow.curve.swap({ sell: [DAI, USDC], buy: [DAI, USDC] })
]

// Apply the permissions to a role
const roleKey = encodeBytes32String('my-role')
const calls = await apply(roleKey, permissions, {
  currentPermissions: [],
  mode: 'extend', // keep the current permissions
  log: console.debug
})

// Log the calls for updating the configuration of the Roles mod
console.log(calls)
`
}
