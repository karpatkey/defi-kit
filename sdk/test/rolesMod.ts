import {
  ContractAddresses,
  ContractFactories,
  KnownContracts,
  calculateProxyAddress,
  deployAndSetUpModule,
} from "@gnosis-guild/zodiac"
import { encodeBytes32String } from "../src"
import { avatar, deployer, member, owner } from "./wallets"
import { ethers } from "ethers"

export const testRoleKey = encodeBytes32String("TEST-ROLE")

const SALT =
  "0x0000000000000000000000000000000000000000000000000000000000000000"

const predictRolesModAddress = () => {
  const encodedInitParams = ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "address"],
    [owner._address, avatar._address, avatar._address]
  )

  const moduleSetupData = ContractFactories[KnownContracts.ROLES_V2]
    .createInterface()
    .encodeFunctionData("setUp", [encodedInitParams])

  return calculateProxyAddress(
    ContractFactories[KnownContracts.FACTORY].connect(
      ContractAddresses[1][KnownContracts.FACTORY],
      deployer
    ),
    ContractAddresses[1][KnownContracts.ROLES_V2],
    moduleSetupData,
    SALT
  )
}

export async function deployRolesMod() {
  const { expectedModuleAddress, transaction } = await deployAndSetUpModule(
    KnownContracts.ROLES_V2,
    {
      types: ["address", "address", "address"],
      values: [owner._address, avatar._address, avatar._address],
    },
    deployer.provider,
    await deployer.getChainId(),
    SALT
  )

  if (expectedModuleAddress !== predictRolesModAddress()) {
    throw new Error(
      `Roles mod address deployment unexpected, expected ${predictRolesModAddress()}, actual: ${expectedModuleAddress}`
    )
  }

  try {
    await deployer.sendTransaction(transaction)
  } catch (e) {
    console.error(e)
  }

  console.log("Roles mod deployed at", expectedModuleAddress)
}

export const getRolesMod = () => {
  return ContractFactories[KnownContracts.ROLES_V2].connect(
    predictRolesModAddress(),
    owner
  )
}

export async function setupRole() {
  const rolesMod = getRolesMod()
  await rolesMod.assignRoles(
    member._address,
    [encodeBytes32String("TEST-ROLE")],
    [true]
  )
  console.log("Created TEST-ROLE role with member:", member._address)
}
