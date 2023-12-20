import { eth } from "."
import { avatar } from "../../../test/wallets"
import { applyPermissions } from "../../../test/helpers"
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { queryCdps, queryIlk, queryProxy } from "./utils"
import { BigNumber } from "ethers"
import { parseEther } from "ethers/lib/utils"
import { testKit } from "../../../test/kit"

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

const getProxy = async () => {
  const proxyAddress = await queryProxy(avatar._address as `0x${string}`)
  const proxy = testKit.eth.maker.DsProxy.attach(proxyAddress)
  return proxy
}

const buildProxy = async () => {
  const sdk = getMainnetSdk(avatar)
  await sdk.maker.ProxyRegistry["build(address)"](avatar._address)
  return await getProxy()
}

const openMakerCdp = async ({ ilk }: { ilk: string }) => {
  const sdk = getMainnetSdk(avatar)
  const proxy = await buildProxy()

  await proxy["execute(address,bytes)"](
    sdk.maker.ProxyActions.address,
    sdk.maker.ProxyActions.interface.encodeFunctionData("open", [
      sdk.maker.CdpManager.address,
      ilk,
      proxy.address,
    ])
  )
  return (await queryCdps(proxy.address as `0x${string}`))[0]
}

describe("maker", () => {
  describe("deposit", () => {
    let cdp: BigNumber

    beforeAll(async () => {
      cdp = await openMakerCdp({
        ilk: "0x4554482d41000000000000000000000000000000000000000000000000000000",
      })

      await applyPermissions(
        await eth.deposit({ avatar: avatar._address as `0x${string}` })
      )
    })

    it("allows depositing ETH to an existing cdp", async () => {
      const sdk = getMainnetSdk(avatar)
      const proxy = await getProxy()

      // eth-sdk config powers different "kits":
      // sdk - doing stuff directly in the name of whatever wallet you init it with
      // testKit - doing stuff through the test roles in the name of the avatar
      // allow - returning permissions to do that call through the test role (allowing the respective testKit... call)

      const ilk = await queryIlk(cdp)

      await expect(
        proxy["execute(address,bytes)"](
          sdk.maker.ProxyActions.address,
          sdk.maker.ProxyActions.interface.encodeFunctionData("lockETH", [
            sdk.maker.CdpManager.address,
            ilk.gemJoin,
            cdp,
          ]),
          { value: parseEther("1") }
        )
      ).not.toRevert()

      // make sure permissions really only allow to lock to our own CDPs
      await expect(
        proxy["execute(address,bytes)"](
          sdk.maker.ProxyActions.address,
          sdk.maker.ProxyActions.interface.encodeFunctionData("lockETH", [
            sdk.maker.CdpManager.address,
            ilk.gemJoin,
            123,
          ]),
          { value: parseEther("1") }
        )
      ).toBeForbidden()
    })
  })
})
