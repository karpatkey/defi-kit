import { eth } from "."
import { avatar, member } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { testKit } from "../../../test/kit"
import { parseEther } from "ethers/lib/utils"

const steCRV_pool = "0xDC24316b9AE028F1497c275EB9192a3Ea0f67022"

describe("lido", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit())
    })

    it("allows submitting ETH", async () => {
      await expect(
        testKit.eth.lido.steth.submit(avatar._address, {
          value: parseEther('2'),
        })
      ).not.toRevert()
    })

    it("allows wrapping and unwrapping stETH", async () => {
      await stealErc20(contracts.mainnet.lido.steth, parseEther('2'), steCRV_pool)
      await expect(
        testKit.eth.lido.steth.approve(contracts.mainnet.lido.wsteth, parseEther('2'))
      ).not.toRevert()
      await expect(testKit.eth.lido.wsteth.wrap(parseEther('2'))).not.toRevert()
      await expect(testKit.eth.lido.wsteth.unwrap(parseEther('1'))).not.toRevert()
    })

    it("only allows requesting withdrawals from avatar's positions", async () => {
      const avatarAddress = avatar._address
      await expect(
        testKit.eth.lido.steth.approve(contracts.mainnet.lido.unsteth, parseEther('2'))
      )
      await expect(
        testKit.eth.lido.unsteth.requestWithdrawals([parseEther('0.5')], avatarAddress)
      ).not.toRevert()

      const anotherAddress = member._address
      await expect(
        testKit.eth.lido.unsteth.requestWithdrawals([parseEther('1')], anotherAddress)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
