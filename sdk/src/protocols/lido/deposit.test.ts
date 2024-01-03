import { eth } from "."
import { avatar, member } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { testKit } from "../../../test/kit"
import { parseEther } from "ethers/lib/utils"
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"


async function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const sdk = getMainnetSdk(avatar)

describe("lido", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit())
    })

    it("allows submitting ETH", async () => {
      await expect(
        testKit.eth.lido.steth.submit(avatar._address, {
          value: parseEther('10'),
        })
      ).not.toRevert()
    })

    it("allows wrapping and unwrapping stETH", async () => {
      await expect(
        testKit.eth.lido.steth.approve(contracts.mainnet.lido.wsteth, parseEther('5'))
      ).not.toRevert()
      await expect(testKit.eth.lido.wsteth.wrap(parseEther('5'))).not.toRevert()
      await expect(testKit.eth.lido.wsteth.unwrap(parseEther('1'))).not.toRevert()
    })

    it("only allows requesting withdrawals from avatar's positions", async () => {
      var amount = await sdk.lido.steth.balanceOf(
        avatar._address
      )
      console.log("Amount of stETH: ", amount.toBigInt())
      await expect(
        testKit.eth.lido.steth.approve(contracts.mainnet.lido.unsteth, parseEther('1'))
      )
      await delay(2000);
      await expect(
        testKit.eth.lido.unsteth.requestWithdrawals([parseEther('1')], avatar._address)
      ).not.toRevert()

      var amount = await sdk.lido.wsteth.balanceOf(
        avatar._address
      )
      console.log("Amount of wstETH: ", amount.toBigInt())
      await expect(
        testKit.eth.lido.wsteth.approve(contracts.mainnet.lido.unsteth, parseEther('1'))
      )
      await delay(2000);
      await expect(
        testKit.eth.lido.unsteth.requestWithdrawalsWstETH([parseEther('1')], avatar._address)
      ).not.toRevert()

      await expect(
        testKit.eth.lido.unsteth.requestWithdrawals([parseEther('1')], member._address)
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        testKit.eth.lido.unsteth.requestWithdrawalsWstETH([parseEther('1')], member._address)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
