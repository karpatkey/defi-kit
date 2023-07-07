import { eth } from "."
import { getAvatarWallet } from "../../../test/accounts"
import { configurePermissions, test } from "../../../test/helpers"

describe("lido", () => {
  describe("deposit", () => {
    beforeAll(async () => {})

    it("allows submitting ETH", async () => {
      await configurePermissions(eth.deposit())
      test.eth.lido.steth.submit(getAvatarWallet().address)
      // await expect().resolves.not.toThrow(
    })

    it("allows wrapping and unwrapping stETH", async () => {})
  })
})
