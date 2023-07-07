import { providers } from "ethers"

let provider: providers.JsonRpcProvider
export const getProvider = () => {
  if (!provider) {
    provider = new providers.JsonRpcProvider("http://127.0.0.1:8545")
  }
  return provider
}
