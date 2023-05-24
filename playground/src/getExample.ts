export const getExampleSourceCode = (exampleName: string) => {
  if (exampleName === "apply") {
    return "TODO"
  }

  // default example
  return `// Welcome to the DeFi Presets SDK Playground
  // You can use this for exploring the SDK and composing your role permissions.
  
  import { encodeBytes32String } from 'defi-presets'
  import { allow, apply } from 'defi-presets/mainnet'
  
  // Mix and match the permissions you need
  const permissions = [
    ...allow.curve.deposit('DAI/USDC/USDT'),
    ...allow.curve.deposit('DAI/USDC/USDT/sUSD'),
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
