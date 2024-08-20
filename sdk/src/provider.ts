import { providers } from "ethers"

console.log("node env", process.env.NODE_ENV)

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

export const arb1Provider = new providers.JsonRpcProvider(
  "https://rpc.arb1.arbitrum.gateway.fm",
  {
    chainId: 42161,
    name: "ArbitrumOne",
  }
)
