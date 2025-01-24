import { eth } from "."
import { avatar } from "../../../test/wallets"
import { contracts } from "../../../eth-sdk/config"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { eth as kit } from "../../../test/kit"
import { parseEther } from "ethers"

// Test constants
const MorphoBluePool = "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb" // gtLRTcore Vault address
const STEAL_ADDRESS = "0xacB7027f271B03B502D65fEBa617a0d817D62b8e" // Address wstETH
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
      const amount = BigInt(parseEther("2").toString())
      const shareAmount = BigInt((amount / 2n).toString())

      await stealErc20(underlying_wsteth, parseEther("10"), STEAL_ADDRESS)
      await kit.asAvatar.weth
        .attach(underlying_wsteth)
        .approve(MorphoBluePool, amount)
      await expect(
        kit.asMember.morpho.morphoBlue
          .attach(MorphoBluePool)
          .supplyCollateral(
            await kit.asMember.morpho.morphoBlue.idToMarketParams(marketId),
            amount,
            avatar.address,
            "0x"
          )
      ).not.toRevert()
      const marketParams = [
        "0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",//WETH9
        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",//WstETH
        "0xbD60A6770b27E084E8617335ddE769241B0e71D8",//MorphoChainlinkOracleV2
        "0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC", //AdaptiveCurveIrm
        965000000000000000n]
    const marketParams2 =     {
        // marketId: "0xb8fc70e82bc5cc53e773626fbb6a23f7eefa036918d7ef216ecfb1950a94a85e",
        // loanToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",//WETH9
        loanToken: "0x000000000000000000000000000000000000dEaD",
        collateralToken: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",//WstETH
        oracle: "0xbD60A6770b27E084E8617335ddE769241B0e71D8",//MorphoChainlinkOracleV2
        irm: "0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC", //AdaptiveCurveIrm
        lltv: "965000000000000000",
    }
    //   marketParams[0] = "0xDEADBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb"

      await expect(
        kit.asMember.morpho.morphoBlue
          .attach(MorphoBluePool)
          .supplyCollateral(
            marketParams2,
            amount,
            avatar.address,
            "0x"
          )
      ).toRevert()
    })
    it("borrow WstETH", async () => {
        const amount = BigInt(parseEther("2").toString())
        const shareAmount = BigInt((amount/2n).toString())

        await stealErc20(underlying_wsteth, parseEther("10"), STEAL_ADDRESS)
        await kit.asAvatar.weth
          .attach(underlying_wsteth)
          .approve(MorphoBluePool, amount)
        await expect(
          kit.asMember.morpho.morphoBlue
            .attach(MorphoBluePool)
            .supplyCollateral(
              await kit.asMember.morpho.morphoBlue.idToMarketParams(marketId),
              amount,
              avatar.address,
              "0x",
            )
        ).not.toRevert()
      })
  })
})
