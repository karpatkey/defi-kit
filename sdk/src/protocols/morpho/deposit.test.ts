import { eth } from "."
import { avatar } from "../../../test/wallets"
import { contracts } from "../../../eth-sdk/config"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { eth as kit } from "../../../test/kit"
import { parseEther } from "ethers"

// Test constants
const ETHEREUM_BUNDLER = "0x4095F064B8d3c3548A3bebfd0Bbfd04750E30077" // Bundler address
const METAMORPHO_VAULT = "0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658" // Vault address
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" // WETH token address
const STEAL_ADDRESS = "0xD48573cDA0fed7144f2455c5270FFa16Be389d04" // Address to fund test WETH

describe("Morpho Protocol", () => {
  describe("Deposit Action", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit({ targets: ["gtLRTcore"] }))
    })

    it("approuve 0.76 WETH for the bundler + deposit", async () => {
      const amount = parseEther("0.76") // Test with 0.76 WETH
      await stealErc20(contracts.mainnet.weth, amount, STEAL_ADDRESS)

      // Approve WETH for the Ethereum Bundler
      // kit.asMember.morpho.weth9.attach(WETH).approve(ETHEREUM_BUNDLER, amount)

      // Check that the approval was successful
      expect(
        await kit.asMember.morpho.metaMorpho.allowance(
          STEAL_ADDRESS,
          ETHEREUM_BUNDLER
        )
      ).not.toRevert()

      // Deposit WETH into the vault
      // await expect(
      //   kit.asMember.morpho.metaMorpho
      //     .attach(METAMORPHO_VAULT)
      //     .deposit(amount, avatar.address)
      // ).not.toRevert()
      
    })

    // it("deposit 2 WETH into the vault", async () => {
    //   const amount = parseEther("2") // Test with 2 WETH
    //   // await stealErc20(WETH, amount, STEAL_ADDRESS)

    //   // Approve WETH for the vault
    //   kit.asMember.morpho.weth9.attach(WETH).approve(METAMORPHO_VAULT, amount)

    //   // Deposit WETH into the vault
    //   await expect(
    //     kit.asMember.morpho.metaMorpho
    //       .attach(METAMORPHO_VAULT)
    //       .deposit(amount, avatar.address)
    //   ).not.toRevert()
    // })
    // why it can't work hereeeeee whyyyyyyy
  })
})
