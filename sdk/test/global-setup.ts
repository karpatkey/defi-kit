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
  getOwnerWallet,
} from "./accounts"
import { baseSnapshot } from "./snapshot"

export default async () => {
  await waitForNetwork()
  await deployRolesMod()

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

  console.log("BAL", deployer.address, await deployer.getBalance())

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
