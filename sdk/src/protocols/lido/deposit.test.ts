import { eth } from "."
import { contracts } from "../../../eth-sdk/config"
import { getAvatarWallet } from "../../../test/accounts"
import { configurePermissions, test } from "../../../test/helpers"
import { Status } from "../../../test/types"
import { allowErc20Approve } from "../../erc20"

describe("lido", () => {
  describe("deposit", () => {
    beforeAll(async () => {})

    it.only("allows submitting ETH", async () => {
      await configurePermissions(
        allowErc20Approve(
          [contracts.mainnet.lido.steth],
          [contracts.mainnet.lido.wsteth]
        )
      )
      // await test.eth.lido.steth.submit(getAvatarWallet().address)
      // await expect(
      //   test.eth.lido.steth.submit(getAvatarWallet().address)
      // ).toBeAllowed()
      // await expect().resolves.not.toThrow(
    })

    it("allows wrapping and unwrapping stETH", async () => {})
  })
})
