import { providers } from "ethers"

let provider: providers.JsonRpcProvider
export const getProvider = () => {
  if (!provider) {
    provider = new providers.JsonRpcProvider("http://127.0.0.1:8545")
    // How long to wait (in ms) before rejecting with a timeout error. (default: 120000).
    // https://docs.ethers.org/v5/api/utils/web/#ConnectionInfo
    provider.connection.timeout = 180000
  }
  return provider
}
