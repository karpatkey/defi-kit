import { eth } from "."
import { avatar } from "../../../test/wallets"
import { contracts } from "../../../eth-sdk/config"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { eth as kit } from "../../../test/kit"
import { parseEther } from "ethers"

// Test constants
const METAMORPHO_VAULT = "0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658" // gtLRTcore Vault address 
const STEAL_ADDRESS = "0xD48573cDA0fed7144f2455c5270FFa16Be389d04" // Address to fund test WETH
const underlying_weth = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" // WETH

describe("Morpho Blue borrow", () => {
  describe("Borrow Action", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.borrow({ blueTargets: ["0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e"] }))
    })

    it("supplyCollateral WstETH", async () => {
      const amount = parseEther("2")

    //   await stealErc20(underlying_weth, amount, STEAL_ADDRESS)
    //   await kit.asAvatar.weth
    //     .attach(underlying_weth)
    //     .approve(METAMORPHO_VAULT, amount)
    //   await expect(
    //     kit.asMember.morpho.metaMorpho.attach(METAMORPHO_VAULT).
    //     deposit(amount, avatar.address)
    //   ).not.toRevert()
    })

  })
})
