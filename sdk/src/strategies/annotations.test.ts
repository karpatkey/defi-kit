import { eth } from "."

describe("annotations", () => {
  it("should annotate all strategy functions", async () => {
    const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    const permissionSet = await eth.disassemble.aura_proportional({
      pools: [],
    })
    expect(permissionSet).toHaveProperty("annotation", {
      uri: "https://kit.karpatkey.com/api/v1/strategy/permissions/eth/disassemble/aura_proportional?buy=0x6B175474E89094C44Da98b954EedeAC495271d0F%2C0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&sell=0x6B175474E89094C44Da98b954EedeAC495271d0F%2C0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      schema: "https://kit.karpatkey.com/api/v1/openapi.json",
    })
  })
})
