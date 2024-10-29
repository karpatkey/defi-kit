import { JsonRpcProvider } from "ethers"

export const ethProvider = new JsonRpcProvider("https://rpc.eth.gateway.fm", {
  chainId: 1,
  name: "Ethereum",
})

export const gnoProvider = new JsonRpcProvider(
  "https://rpc.gnosis.gateway.fm",
  {
    chainId: 100,
    name: "Gnosis",
  }
)

export const arb1Provider = new JsonRpcProvider(
  "https://rpc.arb1.arbitrum.gateway.fm",
  {
    chainId: 42161,
    name: "ArbitrumOne",
  }
)
