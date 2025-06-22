import { eth } from "."
import { wallets } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { eth as kit } from "../../../test/kit"
import { parseEther } from "ethers"
import { Chain } from "../../../src"
import { MarketParams } from "./types"

const MORPHO_BLUE = "0xbbbbbbbbbb9cc5e90e3b3af64bdaf62c37eeffcb"
const STEAL_WSTETH = "0xacb7027f271b03b502d65feba617a0d817d62b8e"
const STEAL_WETH = "0xa1e2481a9cd0cb0447eeb1cbc26f1b3fff3bec20"
const WSTETH = "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0"
const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"

const marketParamsWhitelisted: MarketParams = {
  loanToken: WETH,
  collateralToken: WSTETH,
  oracle: "0xbd60a6770b27e084e8617335dde769241b0e71d8",
  irm: "0x870ac11d48b15db9a138cf899d20f13f79ba00bc",
  lltv: "965000000000000000",
}

const unauthorizedMarketParams = {
  loanToken: "0x000000000000000000000000000000000000dEaD", //dead address
  collateralToken: WSTETH,
  oracle: "0xbd60a6770b27e084e8617335dde769241b0e71d8", //MorphoChainlinkOracleV2
  irm: "0x870ac11d48b15db9a138cf899d20f13f79ba00bc", //AdaptiveCurveIrm
  lltv: "965000000000000000",
}

describe("Borrow Action", () => {
  beforeAll(async () => {
    await applyPermissions(
      Chain.eth,
      await eth.borrow({
        targets: [marketParamsWhitelisted],
      })
    )
  })

  it("supplyCollateral -> borrow -> repay -> withdrawCollateral", async () => {
    const amountCollateral = parseEther("5")
    const amountBorrow = parseEther("2")

    await stealErc20(Chain.eth, WSTETH, parseEther("10"), STEAL_WSTETH)
    await stealErc20(Chain.eth, WETH, parseEther("10"), STEAL_WETH)

    await kit.asMember.weth
      .attach(WSTETH)
      .approve(MORPHO_BLUE, amountCollateral)

    console.log("supply collateral")
    await expect(
      kit.asMember.morpho.morphoBlue
        .attach(MORPHO_BLUE)
        .supplyCollateral(
          marketParamsWhitelisted,
          amountCollateral,
          wallets.avatar,
          "0x"
        )
    ).not.toRevert()

    await expect(
      kit.asMember.morpho.morphoBlue
        .attach(MORPHO_BLUE)
        .supplyCollateral(
          unauthorizedMarketParams,
          amountCollateral,
          wallets.avatar,
          "0x"
        )
    ).toRevert()

    console.log("borrow")
    await expect(
      kit.asMember.morpho.morphoBlue
        .attach(MORPHO_BLUE)
        .borrow(
          marketParamsWhitelisted,
          amountBorrow,
          0,
          wallets.avatar,
          wallets.avatar
        )
    ).not.toRevert()

    await expect(
      kit.asMember.morpho.morphoBlue
        .attach(MORPHO_BLUE)
        .borrow(
          unauthorizedMarketParams,
          amountBorrow,
          0,
          wallets.avatar,
          wallets.avatar
        )
    ).toRevert()

    await kit.asMember.weth.approve(MORPHO_BLUE, amountBorrow)

    console.log("repay")
    await expect(
      kit.asMember.morpho.morphoBlue
        .attach(MORPHO_BLUE)
        .repay(marketParamsWhitelisted, amountBorrow, 0, wallets.avatar, "0x")
    ).not.toRevert()

    console.log("withdraw collateral")
    await expect(
      kit.asMember.morpho.morphoBlue
        .attach(MORPHO_BLUE)
        .withdrawCollateral(
          marketParamsWhitelisted,
          amountCollateral,
          wallets.avatar,
          wallets.avatar
        )
    ).not.toRevert()
  })
})
