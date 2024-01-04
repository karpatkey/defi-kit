import { Permission } from "zodiac-roles-sdk"
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { BigNumber, BigNumberish, Contract, Overrides } from "ethers"
import { avatar, owner, member } from "./wallets"
import { getProvider } from "./provider"
import { createApply } from "../src/apply"
import { Interface, parseEther } from "ethers/lib/utils"
import { getRolesMod, testRoleKey } from "./rolesMod"

export const applyPermissions = async (permissions: Permission[]) => {
  const apply = createApply(1) // chainId here won't matter (since we pass currentTargets and currentAnnotations no subgraph queries will be made)
  const calls = await apply(testRoleKey, permissions, {
    address: getRolesMod().address as `0x${string}`,
    mode: "replace",
    log: console.debug,
    currentTargets: [],
    currentAnnotations: [],
  })

  console.log(`Applying permissions with ${calls.length} calls`)
  let nonce = await owner.getTransactionCount()
  await Promise.all(
    calls.map((call) =>
      owner.sendTransaction({
        ...call,
        nonce: nonce++,
      })
    )
  )
  console.log("Permissions applied")
}

export const execThroughRole = async (
  {
    to,
    data,
    value,
    operation = 0,
  }: {
    to: `0x${string}`
    data?: `0x${string}`
    value?: `0x${string}`
    operation?: 0 | 1
  },
  overrides?: Overrides
) =>
  await getRolesMod()
    .connect(member)
    .execTransactionWithRole(
      to,
      value || 0,
      data || "0x",
      operation,
      testRoleKey,
      true,
      overrides
    )

export const callThroughRole = async ({
  to,
  data,
  value,
  operation = 0,
}: {
  to: `0x${string}`
  data?: `0x${string}`
  value?: `0x${string}`
  operation?: 0 | 1
}) =>
  await getRolesMod()
    .connect(member)
    .callStatic.execTransactionWithRole(
      to,
      value || 0,
      data || "0x",
      operation,
      testRoleKey,
      false
    )

const erc20Interface = new Interface([
  "function transfer(address to, uint amount) returns (bool)",
])

export const stealErc20 = async (
  token: `0x${string}`,
  amount: BigNumberish,
  from: `0x${string}`
) => {
  const provider = getProvider()

  // Get the token contract with impersonated signer
  const contract = new Contract(
    token,
    erc20Interface,
    await provider.getSigner(from)
  )

  // Impersonate the token holder and give a little gas stipend
  await provider.send("anvil_impersonateAccount", [from])
  await provider.send("anvil_setBalance", [from, parseEther("1").toHexString()])

  // Transfer the requested amount to the avatar
  await contract.transfer(await avatar.getAddress(), amount)

  // Stop impersonating
  await provider.send("anvil_stopImpersonatingAccount", [from])
}

export async function advanceTime(seconds: number) {
  const provider = getProvider()
  await provider.send("evm_increaseTime", [seconds])
}
