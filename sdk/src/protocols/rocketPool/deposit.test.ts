import { eth } from "."
import { queryDepositPool } from "./utils"
import { applyPermissions } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { eth as kit } from "../../../test/kit"
import { parseEther } from "ethers"

describe("rocketPool", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit())
    })

    it("query pool", async () => {
      const deposit_pool = await queryDepositPool()
      console.log("Deposit Pool: ", deposit_pool)
    })

    it("deposit and withdraw through deposit pool", async () => {
      const deposit_amount =
        await kit.asAvatar.rocketPool.depositPool.getMaximumDepositAmount()

      if (deposit_amount > 0n) {
        await expect(
          kit.asMember.rocketPool.depositPool.deposit({
            value: parseEther("1"),
          })
        ).not.toRevert()

        await expect(
          kit.asMember.rocketPool.rEth.burn(parseEther("0.01"))
        ).not.toRevert()
      }
    })

    it("deposit and withdraw using secondary markets with swap router (only through roles)", async () => {
      await expect(
        kit.asMember.rocketPool.swapRouter.swapTo(
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
        kit.asMember.rocketPool.rEth.approve(
          contracts.mainnet.rocketPool.swapRouter,
          parseEther("50000")
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.rocketPool.swapRouter.swapFrom(
          0,
          10,
          parseEther("14000"),
          parseEther("15000"),
          parseEther("50000")
        )
      ).toBeAllowed()
    }, 120000)
  })
})