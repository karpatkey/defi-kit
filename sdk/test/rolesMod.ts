import {
  ContractAddresses,
  ContractFactories,
  KnownContracts,
  calculateProxyAddress,
  deployAndSetUpModule,
} from "@gnosis-guild/zodiac"
import { avatar, deployer, member, owner } from "./wallets"
import { getProvider } from "./provider"
import { AbiCoder, Contract, encodeBytes32String } from "ethers"

const defaultAbiCoder = AbiCoder.defaultAbiCoder()

export const testRoleKey = encodeBytes32String("TEST-ROLE") as `0x${string}`

const SALT =
  "0x0000000000000000000000000000000000000000000000000000000000000000"

const predictRolesModAddress = async () => {
  const encodedInitParams = defaultAbiCoder.encode(
    ["address", "address", "address"],
    [owner.address, avatar.address, avatar.address]
  )

  const moduleSetupData = ContractFactories[KnownContracts.ROLES_V2]
    .createInterface()
    .encodeFunctionData("setUp", [encodedInitParams])

  return calculateProxyAddress(
    ContractFactories[KnownContracts.FACTORY].connect(
      ContractAddresses[1][KnownContracts.FACTORY],
      await deployer.getSigner()
    ) as unknown as Contract,
    ContractAddresses[1][KnownContracts.ROLES_V2],
    moduleSetupData,
    SALT
  )
}

export async function deployRolesMod() {
  const deployerSigner = await deployer.getSigner()
  const { expectedModuleAddress, transaction } = await deployAndSetUpModule(
    KnownContracts.ROLES_V2,
    {
      types: ["address", "address", "address"],
      values: [owner.address, avatar.address, avatar.address],
    },
    deployerSigner.provider,
    Number((await getProvider().getNetwork()).chainId),
    SALT
  )

  if (expectedModuleAddress !== (await predictRolesModAddress())) {
    throw new Error(
      `Roles mod address deployment unexpected, expected ${predictRolesModAddress()}, actual: ${expectedModuleAddress}`
    )
  }

  try {
    await deployerSigner.sendTransaction(transaction)
  } catch (e) {
    console.error(e)
  }

  console.log("Roles mod deployed at", expectedModuleAddress)
}

export const getRolesMod = async () => {
  return ContractFactories[KnownContracts.ROLES_V2].connect(
    await predictRolesModAddress(),
    await owner.getSigner()
  )
}

export async function setupRole() {
  const rolesMod = await getRolesMod()
  await rolesMod.assignRoles(
    member.address,
    [encodeBytes32String("TEST-ROLE")],
    [true]
  )
  console.log("Created TEST-ROLE role with member:", member.address)
}
