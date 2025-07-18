import { eth } from "."
import { wallets } from "../../../../test/wallets"
import { applyPermissions } from "../../../../test/helpers"
import { eth as kit } from "../../../../test/kit"
import { Chain } from "../../../../src"

const recipient = "0xC01318baB7ee1f5ba734172bF7718b5DC6Ec90E1"

describe("circleV2", () => {
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
        kit.asMember.circleV2.messageTransmitter.receiveMessage(
          "0x0000000100000003000000005c8f78327b65bfa2becd0e3e5944776f17617d4af00bf818af36dc5646e5d5c500000000000000000000000028b5a0e9c621a5badaa536219b3a228c8168cf5d00000000000000000000000028b5a0e9c621a5badaa536219b3a228c8168cf5d000000000000000000000000000000000000000000000000000000000000000000000041000007d000000001000000000000000000000000af88d065e77c8cc2239327c5edb3a432268e5831000000000000000000000000c01318bab7ee1f5ba734172bf7718b5dc6ec90e10000000000000000000000000000000000000000000000000000000000989680000000000000000000000000def1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
          "0x"
        )
      ).toBeAllowed()
    })
  })
})
