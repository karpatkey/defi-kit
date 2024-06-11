import { eth } from "."
import { applyPermissions } from "../../../test/helpers"
import { avatar, member } from "../../../test/wallets"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { testKit } from "../../../test/kit"
import { parseEther } from "ethers/lib/utils"

describe("ankr", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit())
    })

    it("deposit ETH", async () => {
      await expect(
        testKit.eth.ankr.ETH2_Staking.stakeAndClaimAethC({
          value: parseEther("5"),
        })
      ).not.toRevert()
    })

    it("only withdraw with flash unstake to avatar", async () => {
      await expect(
        testKit.eth.ankr.ankrETH.approve(
          contracts.mainnet.ankr.flashUnstake,
          parseEther("1")
        )
      ).toBeAllowed()
      await expect(
        testKit.eth.ankr.flashUnstake.swapEth(
          parseEther("0.000001"),
          avatar._address
        )
      ).not.toRevert()
      await expect(
        testKit.eth.ankr.flashUnstake.swapEth(
          parseEther("0.01"),
          member._address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("withdraw with standard unstake", async () => {
      await expect(
        testKit.eth.ankr.ETH2_Staking.unstakeAETH(parseEther("1"))
      ).not.toRevert()
    })
  })
})
