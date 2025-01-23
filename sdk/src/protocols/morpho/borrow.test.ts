import { eth } from "."
import { avatar } from "../../../test/wallets"
import { contracts } from "../../../eth-sdk/config"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { eth as kit } from "../../../test/kit"
import { parseEther } from "ethers"

// Test constants
const MorphoBluePool = "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb" // gtLRTcore Vault address
const STEAL_ADDRESS = "0xD48573cDA0fed7144f2455c5270FFa16Be389d04" // Address to fund test WETH
const underlying_wsteth = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0" // WstETH
const marketId =
  "0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e"
// const loanToken = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"//WETH9
// const collateralToken = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"//WstETH
// const oracle = "0xbD60A6770b27E084E8617335ddE769241B0e71D8"//MorphoChainlinkOracleV2
// const irm = "0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC" //AdaptiveCurveIrm
// const lltv = "965000000000000000"

describe("Morpho Blue borrow", () => {
  describe("Borrow Action", () => {
    beforeAll(async () => {
      await applyPermissions(
        await eth.borrow({
          blueTargets: [
            "0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e",
          ],
        })
      )
    })
    
    it("supplyCollateral WstETH", async () => {
      const amount = parseEther("2")
      const shareAmount = BigInt(amount.toString())

      await stealErc20(underlying_wsteth, amount, STEAL_ADDRESS)
      await kit.asAvatar.weth
        .attach(underlying_wsteth)
        .approve(MorphoBluePool, amount)
      await expect(
        kit.asMember.morpho.morphoBlue
          .attach(MorphoBluePool)
          .borrow(
            await kit.asMember.morpho.morphoBlue.idToMarketParams(marketId),
            amount,
            shareAmount,
            avatar.address,
            "0x"
          )
      ).not.toRevert()
    })
  })
})
