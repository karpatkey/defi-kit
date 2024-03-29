import { eth } from "."
import { queryDepositPool } from "./utils"
import { applyPermissions } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { testKit } from "../../../test/kit"
import { parseEther } from "ethers/lib/utils"

describe("rocket_pool", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit())
    })

    it("query pool", async () => {
      const deposit_pool = await queryDepositPool()
      console.log("Deposit Pool: ", deposit_pool)
    })

    it("deposit and withdraw through deposit pool", async () => {
      await expect(
        testKit.eth.rocket_pool.deposit_pool.deposit({
          value: parseEther("1"),
        })
      ).not.toRevert()

      await expect(
        testKit.eth.rocket_pool.rETH.burn(parseEther("0.01"))
      ).not.toRevert()
    })

    it("deposit and withdraw using secondary markets with swap router (only through roles)", async () => {
      await expect(
        testKit.eth.rocket_pool.swap_router.swapTo(
          3,
          7,
          parseEther("400"),
          parseEther("450"),
          {
            value: parseEther("500"),
          }
        )
      ).toBeAllowed()

      await expect(
        testKit.eth.rocket_pool.rETH.approve(
          contracts.mainnet.rocket_pool.swap_router,
          parseEther("50000")
        )
      ).toBeAllowed()

      console.log("before swapFrom")
      await expect(
        testKit.eth.rocket_pool.swap_router.swapFrom(
          0,
          10,
          parseEther("14000"),
          parseEther("15000"),
          parseEther("50000")
        )
      ).toBeAllowed()
    })
  })
})
