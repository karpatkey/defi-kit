import { getProvider } from "./provider"

const createSigner = async (address: string) => {
  const provider = getProvider()
  return await provider.getSigner(address)
}

export const createWallets = async () => {
  await Promise.all(
    Object.values(addresses).map(async (address) => {
      const provider = getProvider()
      await provider.send("anvil_impersonateAccount", [address])
      await provider.send("anvil_setBalance", [
        address,
        "0x21E19E0C9BAB2400000",
      ])
    })
  )
}

const addresses = {
  deployer: "0xdef1dddddddddddddddddddddddddddddddddddd",
  avatar: "0xdef1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  owner: "0xdef1010101010101010101010101010101010101",
  member: "0xdef1123412341234123412341234123412341234",
  other: "0xdef10f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f",
}

export const deployer = {
  address: addresses.deployer,
  getSigner: () => createSigner(addresses.deployer),
}
export const avatar = {
  address: addresses.avatar,
  getSigner: () => createSigner(addresses.avatar),
}
export const owner = {
  address: addresses.owner,
  getSigner: () => createSigner(addresses.owner),
}
export const member = {
  address: addresses.member,
  getSigner: () => createSigner(addresses.member),
}
export const other = {
  address: addresses.other,
  getSigner: () => createSigner(addresses.other),
}
