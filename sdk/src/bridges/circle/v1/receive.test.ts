import { eth } from "."
import { wallets } from "../../../../test/wallets"
import { applyPermissions } from "../../../../test/helpers"
import { eth as kit } from "../../../../test/kit"
import { Chain } from "../../../../src"

const recipient = "0xC01318baB7ee1f5ba734172bF7718b5DC6Ec90E1"

describe("circleV1", () => {
  describe("receive", () => {
    beforeAll(async () => {
      await applyPermissions(
        Chain.eth,
        await eth.receive({
          targets: ["Arbitrum"],
          sender: wallets.avatar as `0x${string}`,
          recipient: recipient,
        })
      )
    })

    it("receive USDC on Ethereum from Arbitrum", async () => {
      // Test that the transaction goes through the roles
      await expect(
        kit.asMember.circleV1.messageTransmitter.receiveMessage(
          "0x000000000000000300000000000000000006d88200000000000000000000000019330d10d9cc8751218eaf51e8885d058642e08a000000000000000000000000bd3fa81b58ba92a82136038b25adec7066af3155000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000af88d065e77c8cc2239327c5edb3a432268e5831000000000000000000000000c01318bab7ee1f5ba734172bf7718b5dc6ec90e1000000000000000000000000000000000000000000000000000000003b9aca00000000000000000000000000def1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          "0x"
        )
      ).toBeAllowed()
    })
  })
})
