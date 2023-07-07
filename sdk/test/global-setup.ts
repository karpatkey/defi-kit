import waitOn from "wait-on"
import {
  Integrity__factory,
  Packer__factory,
  Roles__factory,
} from "./rolesModTypechain"
import {
  ROLES_ADDRESS,
  getAvatarWallet,
  getDeployerWallet,
  getMemberWallet,
  getOwnerWallet,
} from "./accounts"
import { baseSnapshot } from "./snapshot"
import { encodeBytes32String } from "../src"
import { getProvider } from "./provider"

export default async () => {
  await waitForNetwork()

  if ((await getProvider().getCode(ROLES_ADDRESS)) !== "0x") {
    console.log("Roles mod already deployed, skipping global setup.")
    return
  }

  await deployRolesMod()
  await setupRole()
  await baseSnapshot()
}

async function waitForNetwork() {
  console.log("\nWaiting for network to be ready...")
  await waitOn({
    interval: 100,
    timeout: 2000,
    resources: ["http://127.0.0.1:8545/"],
    validateStatus(status: number) {
      return status === 405
    },
  })
  console.log("Network is ready!")
}

async function deployRolesMod() {
  const deployer = getDeployerWallet()
  const avatar = getAvatarWallet()
  const owner = getOwnerWallet()

  console.log("\nDeploying Integrity...")
  const integrity = await new Integrity__factory(deployer).deploy()
  console.log("Integrity deployed at:", integrity.address)

  console.log("\nDeploying Packer...")
  const packer = await new Packer__factory(deployer).deploy()
  console.log("Packer deployed at:", packer.address)

  console.log("\nDeploying Roles...")
  const roles = await new Roles__factory(
    {
      "contracts/Integrity.sol:Integrity": integrity.address,
      "contracts/packers/Packer.sol:Packer": packer.address,
    },
    deployer
  ).deploy(owner.address, avatar.address, avatar.address)
  console.log("Roles deployed at:", roles.address)

  if (roles.address !== ROLES_ADDRESS) {
    throw new Error(
      "Roles mod was not deployed at the expected address. Something must have changed in the setup, please update the ROLES_ADDRESS constant"
    )
  }
}

async function setupRole() {
  const member = getMemberWallet().address
  const rolesMod = Roles__factory.connect(ROLES_ADDRESS, getOwnerWallet())
  await rolesMod.assignRoles(member, [encodeBytes32String("TEST-ROLE")], [true])
  console.log("Created TEST-ROLE role with member:", member)
}
