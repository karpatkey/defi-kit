import { getProvider } from "./provider"

const createSigner = (address: string) => {
  const provider = getProvider()
  return provider.getSigner(address)
}

const addresses = {
  deployer: "0xdef1dddddddddddddddddddddddddddddddddddd",
  avatar: "0xdef1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  owner: "0xdef1010101010101010101010101010101010101",
  member: "0xdef1123412341234123412341234123412341234",
  other: "0xdef10f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f",
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

export const deployer = await createSigner(addresses.deployer)
export const avatar = await createSigner(addresses.avatar)
export const owner = await createSigner(addresses.owner)
export const member = await createSigner(addresses.member)
export const other = await createSigner(addresses.other)

// export const getDeployerWallet = () => createSigner(addresses["deployer"])
// export const getAvatarWallet = () => wallets["avatar"]
// export const getOwnerWallet = () => wallets["owner"]
// export const getMemberWallet = () => wallets["member"]
// export const getOtherWallet = () => wallets["other"]
