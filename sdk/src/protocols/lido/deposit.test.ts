import { eth } from "."
import { avatar, member } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { testKit } from "../../../test/kit"

describe("lido", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit())
    })

    it("allows submitting ETH", async () => {
      await expect(
        testKit.eth.lido.steth.submit(avatar._address, {
          value: 1000,
        })
      ).not.toRevert()
    })

    it("allows wrapping and unwrapping stETH", async () => {
      await stealErc20(contracts.mainnet.lido.steth, 1000, contracts.mainnet.balancer.vault)
      await expect(
        testKit.eth.lido.steth.approve(contracts.mainnet.lido.wsteth, 1000)
      ).not.toRevert()
      await expect(testKit.eth.lido.wsteth.wrap(1000)).not.toRevert()
      await expect(testKit.eth.lido.wsteth.unwrap(1000)).not.toRevert()
    })

    it("only allows requesting withdrawals from avatar's positions", async () => {
      const avatarAddress = avatar._address
      await expect(
        testKit.eth.lido.steth.approve(contracts.mainnet.lido.unsteth, 1000)
      )
      await expect(
        testKit.eth.lido.unsteth.requestWithdrawals([1000], avatarAddress)
      ).not.toRevert()

      const anotherAddress = member._address
      await expect(
        testKit.eth.lido.unsteth.requestWithdrawals([1000], anotherAddress)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
