import { eth } from "."
import { wallets } from "../../../../test/wallets"
import { applyPermissions } from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { eth as kit } from "../../../../test/kit"
import { parseEther } from "ethers"
import { Chain } from "../../.."

const b50Weth50AuraPid =
  "0xcfca23ca9ca720b6e98e3eb9b6aa0ffc4a5c08b9000200000000000000000274"
const aura = "0xC0c293ce456fF0ED870ADd98a0828Dd4d2903DBF"

describe("balancer", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(
        Chain.eth,
        await eth.deposit({ targets: ["50WETH-50AURA"] })
      )
    })

    it("only deposit and withdraw from avatar", async () => {
      await kit.asAvatar.weth.deposit({ value: parseEther("1") })
      await expect(
        kit.asMember.weth.approve(
          contracts.mainnet.balancerV2.vault,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.balancerV2.vault.joinPool(
          b50Weth50AuraPid,
          wallets.avatar,
          wallets.avatar,
          {
            assets: [contracts.mainnet.weth, aura],
            maxAmountsIn: [parseEther("1"), 0],
            userData:
              "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000000",
            fromInternalBalance: false,
          }
        )
      ).not.toRevert()
      // member address not allowed
      await expect(
        kit.asMember.balancerV2.vault.joinPool(
          b50Weth50AuraPid,
          wallets.member,
          wallets.member,
          {
            assets: [contracts.mainnet.weth, aura],
            maxAmountsIn: [parseEther("1"), 0],
            userData:
              "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000000",
            fromInternalBalance: false,
          }
        )
      ).toBeForbidden()
      // pool id not allowed
      await expect(
        kit.asMember.balancerV2.vault.joinPool(
          "0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014",
          wallets.avatar,
          wallets.avatar,
          {
            assets: [contracts.mainnet.weth, aura],
            maxAmountsIn: [parseEther("1"), 0],
            userData:
              "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000000",
            fromInternalBalance: false,
          }
        )
      ).toBeForbidden()

      await expect(
        kit.asMember.balancerV2.vault.exitPool(
          b50Weth50AuraPid,
          wallets.avatar,
          wallets.avatar,
          {
            assets: [contracts.mainnet.weth, aura],
            minAmountsOut: [0, 0],
            userData:
              "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000000",
            toInternalBalance: false,
          }
        )
      ).not.toRevert()
      // member address not allowed
      await expect(
        kit.asMember.balancerV2.vault.exitPool(
          b50Weth50AuraPid,
          wallets.member,
          wallets.member,
          {
            assets: [contracts.mainnet.weth, aura],
            minAmountsOut: [0, 0],
            userData:
              "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000000",
            toInternalBalance: false,
          }
        )
      ).toBeForbidden()
      // pool id not allowed
      await expect(
        kit.asMember.balancerV2.vault.exitPool(
          "0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014",
          wallets.avatar,
          wallets.avatar,
          {
            assets: [contracts.mainnet.weth, aura],
            minAmountsOut: [0, 0],
            userData:
              "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000000",
            toInternalBalance: false,
          }
        )
      ).toBeForbidden()
    })
  })
})
