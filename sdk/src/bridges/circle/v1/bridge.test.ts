import { eth } from "."
import { applyPermissions, stealErc20 } from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { eth as kit } from "../../../../test/kit"
import { parseUnits } from "ethers"
import { Chain } from "../../../../src"

const recipient = "0xC01318baB7ee1f5ba734172bF7718b5DC6Ec90E1"

describe("circleV1", () => {
  describe("bridge", () => {
    beforeAll(async () => {
      await applyPermissions(
        Chain.eth,
        await eth.bridge({ targets: ["Arbitrum"], recipient: recipient })
      )
    })

    it("bridge USDC from Ethereum to Arbitrum", async () => {
      await stealErc20(
        Chain.eth,
        contracts.mainnet.usdc,
        parseUnits("1000", 6),
        contracts.mainnet.balancer.vault
      )
      await expect(
        kit.asMember.usdc.approve(
          contracts.mainnet.circleV1.tokenMessenger,
          parseUnits("1000", 6)
        )
      ).not.toRevert()
      await expect(
        kit.asMember.circleV1.tokenMessenger.depositForBurn(
          parseUnits("1000", 6),
          3, // Destination: Arbitrum Domain
          "0x" + recipient.slice(2).padStart(64, "0"),
          contracts.mainnet.usdc
        )
      ).not.toRevert()
    })
  })
})
