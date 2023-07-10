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
import { parseEther } from "ethers/lib/utils"

export default async () => {
  await waitForNetwork()

  if ((await getProvider().getCode(ROLES_ADDRESS)) !== "0x") {
    console.log("Roles mod already deployed, skipping global setup.")
    return
  }

  await deployERC2470SingletonFactory()
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

const ERC2470_SINGLETON_FACTORY_ADDRESS =
  "0xce0042b868300000d44a59004da54a005ffdcf9f"

export const deployERC2470SingletonFactory = async () => {
  console.log("\nDeploying ERC2470 singleton factory...")
  const deployer = getDeployerWallet()
  await deployer.sendTransaction({
    to: "0xBb6e024b9cFFACB947A71991E386681B1Cd1477D",
    value: parseEther("0.0247"),
  })

  const provider = getProvider()
  await provider.sendTransaction(
    "0xf9016c8085174876e8008303c4d88080b90154608060405234801561001057600080fd5b50610134806100206000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80634af63f0214602d575b600080fd5b60cf60048036036040811015604157600080fd5b810190602081018135640100000000811115605b57600080fd5b820183602082011115606c57600080fd5b80359060200191846001830284011164010000000083111715608d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550509135925060eb915050565b604080516001600160a01b039092168252519081900360200190f35b6000818351602085016000f5939250505056fea26469706673582212206b44f8a82cb6b156bfcc3dc6aadd6df4eefd204bc928a4397fd15dacf6d5320564736f6c634300060200331b83247000822470"
  )

  if ((await provider.getCode(ERC2470_SINGLETON_FACTORY_ADDRESS)) === "0x") {
    throw new Error("ERC2470 singleton factory was not deployed")
  }
  console.log(
    "ERC2470 singleton factory deployed at:",
    ERC2470_SINGLETON_FACTORY_ADDRESS
  )
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
