import { getIndexedAccountPath, MaxUint256, parseEther } from "ethers"
import { eth } from "."
import { eth as kit } from "../../../test/kit"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { bigint } from "zod"
import { avatar } from "../../../test/wallets"

const stETH = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
const rseth = contracts.mainnet.kelp.rseth
const ETH = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
const ETHx = contracts.mainnet.kelp.ethx
const stealAddressStEth = "0x47176B2Af9885dC6C4575d4eFd63895f7Aaa4790"
const stealAddressEthx = "0x59Ab5a5b5d617E478a2479B0cAD80DA7e2831492"
const stealAddressEth = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"

describe("kelp", () => {
  describe("eth", () => {
    describe("stake action", () => {
      beforeAll(async () => {
        await applyPermissions(
          await eth.stake({
            targets: ["stETH", "ETHx", "ETH"],
          })
        )
      })

      it("stake + unstake stETH", async () => {
        console.log("stake stETH")
        const amount = parseEther("1")
        let balance = await kit.asMember.lido.stEth.balanceOf(avatar.address)
        console.log("[1.0] balance before stealing stEth = ", balance)

        await stealErc20(stETH, amount, stealAddressStEth)
        balance = await kit.asMember.lido.stEth.balanceOf(avatar.address)
        console.log("[1.1] balance after stealing stEth = ", balance)

        await expect(
          kit.asMember.lido.stEth.approve(
            contracts.mainnet.kelp.LRTDepositPool,
            amount
          )
        ).not.toRevert()
        await expect(
          kit.asMember.kelp.LRTDepositPool.depositAsset(
            "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
            amount,
            0,
            "0xd05723c7b17b4e4c722ca4fb95e64ffc54a70131c75e2b2548a456c51ed7cdaf"
          )
        ).not.toRevert()

        // //////////////////////////////////////////////////////////////////////////////////

        console.log("unstake stETH")
        balance = await kit.asMember.kelp.rseth.balanceOf(avatar.address)
        console.log("[2.0] balance rseth before unstake stETH = ", balance)
        await expect(
          kit.asMember.kelp.rseth.approve(
            contracts.mainnet.kelp.LRTWithdrawalManager,
            balance
          )
        ).not.toRevert()

        await expect(
          kit.asMember.kelp.LRTWithdrawalManager.initiateWithdrawal(
            "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
            balance,
            "0xd05723c7b17b4e4c722ca4fb95e64ffc54a70131c75e2b2548a456c51ed7cdaf"
          )
        ).not.toRevert()

        balance = await kit.asMember.kelp.rseth.balanceOf(avatar.address)
        console.log("[2.1] balance rseth after = ", balance)
      })

      it("stake + unstake ETHx", async () => {
        console.log("stake ETHx")
        const amount = parseEther("10")
        await stealErc20(ETHx, amount, stealAddressEthx)
        await expect(
          kit.asMember.kelp.ethx.approve(
            contracts.mainnet.kelp.LRTDepositPool,
            amount
          )
        ).not.toRevert()
        await expect(
          kit.asMember.kelp.LRTDepositPool.depositAsset(
            ETHx,
            amount,
            0,
            "0xd05723c7b17b4e4c722ca4fb95e64ffc54a70131c75e2b2548a456c51ed7cdaf"
          )
        ).not.toRevert()

        //now unstake

        const balance = await kit.asMember.kelp.rseth.balanceOf(avatar.address)
        // console.log("balance before = ", balance)

        await expect(
          kit.asMember.kelp.rseth.approve(
            contracts.mainnet.kelp.LRTWithdrawalManager,
            balance
          )
        ).not.toRevert()
        await expect(
          kit.asMember.kelp.LRTWithdrawalManager.initiateWithdrawal(
            ETHx,
            balance,
            "0xd05723c7b17b4e4c722ca4fb95e64ffc54a70131c75e2b2548a456c51ed7cdaf"
          )
        ).not.toRevert()
        console.log("balance after = ", balance)
      })

      //*** ETH ***//
      it("stake ETH", async () => {
        console.log("stake ETH")
        const amount = parseEther("1")
        //can't steal ETH because it's not an ERC20

          await expect(
            kit.asMember.kelp.LRTDepositPool.depositETH(
              0,
              "0xd05723c7b17b4e4c722ca4fb95e64ffc54a70131c75e2b2548a456c51ed7cdaf",
              { value: amount }
            )
          ).not.toRevert()
      })
      it("unstake ETH", async () => {
        const amount = parseEther("10")

        const balance = await kit.asMember.kelp.rseth.balanceOf(avatar.address)
        console.log("balance before = ", balance)

        await expect(
          kit.asMember.kelp.rseth.approve(
            contracts.mainnet.kelp.LRTWithdrawalManager,
            balance
          )
        ).not.toRevert()
        await expect(
          kit.asMember.kelp.LRTWithdrawalManager.initiateWithdrawal(
            "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
            balance,
            "0xd05723c7b17b4e4c722ca4fb95e64ffc54a70131c75e2b2548a456c51ed7cdaf"
          )
        ).not.toRevert()
        console.log("balance after = ", balance)
      })
    })
  })
})
