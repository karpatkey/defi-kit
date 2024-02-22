import { eth } from "."
import { applyPermissions } from "../../../test/helpers"
import { avatar, member } from "../../../test/wallets"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { testKit } from "../../../test/kit"
import { parseEther } from "ethers/lib/utils"


describe("stader", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit())
    })

    it("only deposit ETH on behalf of avatar", async () => {
      await expect(
        testKit.eth.stader.staking_pool_manager["deposit(address)"](
          avatar._address,
          {
            value: parseEther("5")
          }
        )
      ).not.toRevert()
      await expect(
        testKit.eth.stader.staking_pool_manager["deposit(address)"](
          member._address,
          {
            value: parseEther("5")
          }
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only withdraw to avatar", async () => {
      await expect(
        testKit.eth.stader.ETHx.approve(
          contracts.mainnet.stader.user_withdraw_manager,
          parseEther("1"),
        )
      ).not.toRevert()
      await expect(
        testKit.eth.stader.user_withdraw_manager["requestWithdraw(uint256,address)"](
          parseEther("1"),
          avatar._address
        )
      ).not.toRevert()
      await expect(
        testKit.eth.stader.user_withdraw_manager["requestWithdraw(uint256,address)"](
          parseEther("1"),
          member._address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("claim withdrawal request through roles", async () => {
      await expect(
        testKit.eth.stader.user_withdraw_manager.claim(665)
      ).toBeAllowed()
    })
  })
})