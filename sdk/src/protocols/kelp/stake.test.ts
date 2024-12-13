import { getIndexedAccountPath, MaxUint256, parseEther } from "ethers"
import { eth } from "."
import { eth as kit } from "../../../test/kit"
import {
  advanceTime,
  applyPermissions,
  stealErc20,
} from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { bigint } from "zod"
import { avatar } from "../../../test/wallets"

const stETH = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
const rseth = contracts.mainnet.kelp.rseth
const ETH = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
const stealAddressStEth = "0x47176B2Af9885dC6C4575d4eFd63895f7Aaa4790"
const stealAddressEthx = "0x59Ab5a5b5d617E478a2479B0cAD80DA7e2831492"
const stealAddressEth = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"

describe("kelp", () => {
  describe("eth", () => {
    describe("stake action", () => {
      // beforeAll(async () => {
      // })
      //   steal stETH -> check if stETH is approved -> deposit stETH -> check if rseth is approved -> initiate withdrawal
      //   check balance of stETH -> check balance of rseth
      it(
        "stake stETH",
        async () => {
          await applyPermissions(
            await eth.stake({
              targets: ["stETH"],
            })
          )
          const amount = parseEther("1")
          let balance = await kit.asMember.lido.stEth.balanceOf(avatar.address)
          console.log("balance before = ", balance)

          await stealErc20(stETH, amount, stealAddressStEth)
          balance = await kit.asMember.lido.stEth.balanceOf(avatar.address)
          console.log("balance after = ", balance)

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
          balance = await kit.asMember.kelp.rseth.balanceOf(avatar.address)
          console.log("balance before = ", balance)
          // const minRsEthAmountToWithdraw =
          //   await kit.asMember.kelp.LRTWithdrawalManager.minRsEthAmountToWithdraw(
          //     contracts.mainnet.lido.stEth
          //   )
          // console.log("minRsETH = ", minRsEthAmountToWithdraw)
          // const getExpectedAssetAmount =
          //   await kit.asMember.kelp.LRTWithdrawalManager.getExpectedAssetAmount(
          //     "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
          //     balance
          //   )
          // console.log("getExpectedRsEthAmount = ", getExpectedAssetAmount)
          // //////////////////////////////////////////////////////////////////////////////////

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
          console.log("balance after = ", balance)
        },
        50 * 1000
      )
      //   it("unstake stETH", async () => {
      //     const amount = parseEther("10")
      //     await stealErc20(stETH, amount, stealAddressStEth)
      //     await expect(
      //         kit.asMember.lido.stEth.approve(
      //           contracts.mainnet.kelp.LRTDepositPool,
      //           amount
      //         )
      //       ).not.toRevert()
      //       await expect(
      //         kit.asMember.kelp.LRTDepositPool.depositAsset(
      //           "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
      //           amount,
      //           0,
      //           "0xd05723c7b17b4e4c722ca4fb95e64ffc54a70131c75e2b2548a456c51ed7cdaf"
      //         )
      //       ).not.toRevert()
      //     //now unstake
      //     // await stealErc20(rseth, amount, stealAddressRsEth)

      //     const balance = await kit.asMember.kelp.rseth.balanceOf(avatar.address)
      //     console.log("balance before = ", balance)

      //     await expect(
      //       kit.asMember.kelp.rseth.approve(
      //         contracts.mainnet.kelp.LRTWithdrawalManager,
      //         balance
      //       )
      //     ).not.toRevert()
      //     await expect(
      //       kit.asMember.kelp.LRTWithdrawalManager.initiateWithdrawal(
      //         "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
      //         balance,
      //         "0xd05723c7b17b4e4c722ca4fb95e64ffc54a70131c75e2b2548a456c51ed7cdaf"
      //       )
      //     ).not.toRevert()
      //     console.log("balance after = ", balance)
      //   })

      //*** ETH ***//
      //   it("stake ETH", async () => {
      //     const amount = parseEther("1")
      //     await expect(
      //       kit.asMember.kelp.LRTDepositPool.depositETH(
      //         0,
      //         "0xd05723c7b17b4e4c722ca4fb95e64ffc54a70131c75e2b2548a456c51ed7cdaf",
      //       )
      //     ).not.toRevert()
      //   })
      //   it("unstake ETH", async () => {
      //     const amount = parseEther("10")
      //     await stealErc20(ETH, amount, stealAddressEth)
      //     await expect(
      //       kit.asMember.kelp.LRTDepositPool.depositETH(
      //         amount,
      //         "0xd05723c7b17b4e4c722ca4fb95e64ffc54a70131c75e2b2548a456c51ed7cdaf"
      //       )
      //     ).not.toRevert()
      //     //now unstake
      //     // await stealErc20(rseth, amount, stealAddressRsEth)

      //     const balance = await kit.asMember.kelp.rseth.balanceOf(avatar.address)
      //     console.log("balance before = ", balance)

      //     await expect(
      //       kit.asMember.kelp.rseth.approve(
      //         contracts.mainnet.kelp.LRTWithdrawalManager,
      //         balance
      //       )
      //     ).not.toRevert()
      //     await expect(
      //       kit.asMember.kelp.LRTWithdrawalManager.initiateWithdrawal(
      //         "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
      //         balance,
      //         "0xd05723c7b17b4e4c722ca4fb95e64ffc54a70131c75e2b2548a456c51ed7cdaf"
      //       )
      //     ).not.toRevert()
      //     console.log("balance after = ", balance)
      //   })
    })
  })
})
