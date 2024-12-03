import { eth } from "."

describe("annotations", () => {
  it("should annotate all strategy functions", async () => {
    const permissionSet = await eth.aura.bpt({
      pools: ["50COW-50WETH"],
    })
    expect(permissionSet).toHaveProperty("annotation", {
      uri: "https://kit.karpatkey.com/api/v1/strategy/permissions/eth/aura/bpt?pools=50COW-50WETH",
      schema: "https://kit.karpatkey.com/api/v1/openapi.json",
    })
  })
})
