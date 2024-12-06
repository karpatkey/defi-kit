import { eth } from "."
import { avatar } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { eth as kit } from "../../../test/kit"
import _ethPools from "./_ethPools"
import { parseEther } from "ethers"

const stealAddress = "0x3c22ec75ea5D745c78fc84762F7F1E6D82a2c5BF"
const defaultCollateral = "0xC329400492c6ff2438472D4651Ad17389fCb843a"
const underlying = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"

describe("symbiotic", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit({ targets: ["wstETHPool"] }))
      //setup:
      await stealErc20(underlying, parseEther("1"), stealAddress) //impersonate as an address with money
      await kit.asAvatar.weth 
        .attach(underlying) // replace weth by underlying address
        .approve(defaultCollateral, parseEther("1"))
    })

    it("symbiotic deposit", async () => {
      await expect(
        kit.asMember.symbiotic.defaultCollateral
          .attach(defaultCollateral)
          ["deposit(address,uint256)"](avatar.address, parseEther("0.01"))
      ).not.toRevert()
    })
  })
})
