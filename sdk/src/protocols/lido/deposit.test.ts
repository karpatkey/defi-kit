import { eth } from "."
import { getAvatarWallet, getMemberWallet } from "../../../test/accounts"
import { applyPermissions, test } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"

describe("lido", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit())
    })

    it("allows submitting ETH", async () => {
      await expect(
        test.eth.lido.steth.submit(getAvatarWallet().address, { value: 10000 })
      ).toBeAllowed()
    })

    it("allows wrapping and unwrapping stETH", async () => {
      await expect(
        test.eth.lido.steth.approve(contracts.mainnet.lido.wsteth, 10000)
      ).toBeAllowed()
      await expect(test.eth.lido.wsteth.wrap(1000)).toBeAllowed()
      await expect(test.eth.lido.wsteth.unwrap(1000)).toBeAllowed()
    })

    it("only allows requesting withdrawals from avatar's positions", async () => {
      const avatarAddress = getAvatarWallet().address
      await expect(
        test.eth.lido.unsteth.requestWithdrawals([1000], avatarAddress)
      ).toBeAllowed()

      const anotherAddress = getMemberWallet().address
      await expect(
        test.eth.lido.unsteth.requestWithdrawals([1000], anotherAddress)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
