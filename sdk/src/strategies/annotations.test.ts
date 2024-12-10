import { eth } from "."

describe("annotations", () => {
  it("should annotate all strategy functions", async () => {
    const permissionSet = await eth.aura.withdraw({
      rewarder: "0xB9D6ED734Ccbdd0b9CadFED712Cf8AC6D0917EcD",
    })
    expect(permissionSet).toHaveProperty("annotation", {
      uri: "https://kit.karpatkey.com/api/v1/strategy/permissions/eth/aura/withdraw?rewarder=0xB9D6ED734Ccbdd0b9CadFED712Cf8AC6D0917EcD",
      schema: "https://kit.karpatkey.com/api/v1/openapi.json",
    })
  })
})
