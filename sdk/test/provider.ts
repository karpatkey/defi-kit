import { JsonRpcProvider } from "ethers"

let provider: JsonRpcProvider
export const getProvider = () => {
  if (!provider) {
    provider = new JsonRpcProvider("http://127.0.0.1:8545")
  }
  return provider
}
