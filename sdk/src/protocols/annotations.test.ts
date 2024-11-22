import { eth } from "."

describe("general: annotations", () => {
  it("should annotate all action functions", async () => {
    const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    const permissionSet = await eth.cowswap.swap({
      buy: [DAI, USDC],
      sell: [DAI, USDC],
    })
    expect(permissionSet).toHaveProperty("annotation", {
      uri: "https://kit.karpatkey.com/api/v1/permissions/eth/cowswap/swap?buy=0x6B175474E89094C44Da98b954EedeAC495271d0F%2C0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&sell=0x6B175474E89094C44Da98b954EedeAC495271d0F%2C0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      schema: "https://kit.karpatkey.com/api/v1/openapi.json",
    })
  })
})
