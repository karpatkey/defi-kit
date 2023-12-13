import { providers } from "ethers"

export const ethProvider = new providers.JsonRpcProvider(
  "https://rpc.eth.gateway.fm",
  {
    chainId: 1,
    name: "Ethereum",
  }
)

export const gnoProvider = new providers.JsonRpcProvider(
  "https://rpc.gnosis.gateway.fm",
  {
    chainId: 100,
    name: "Gnosis",
  }
)
