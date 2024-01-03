import { eth } from "."
import { avatar } from "../../../test/wallets"
import { applyPermissions } from "../../../test/helpers"
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { queryCdps, queryIlk, queryProxy } from "./utils"
import { BigNumber } from "ethers"
import { LogDescription, arrayify, parseEther } from "ethers/lib/utils"
import { testKit } from "../../../test/kit"
import { getProvider } from "../../../test/provider"
import { ethers } from 'ethers'
import { encodeBytes32String } from "../../encode"


const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const getProxy = async () => {
  const proxyAddress = await queryProxy(avatar._address as `0x${string}`)
  console.log({ proxyAddress, avatar: avatar._address })
  const proxy = testKit.eth.maker.DsProxy.attach(proxyAddress)
  return proxy
}

const openMakerCdp = async ({ ilk }: { ilk: string }) => {
  const sdk = getMainnetSdk(avatar)

  // build proxy if it doesn't exist yet
  if (await queryProxy(avatar._address as `0x${string}`) === ZERO_ADDRESS) {
    await sdk.maker.ProxyRegistry["build()"]()
  }

  const proxyAddress = await queryProxy(avatar._address as `0x${string}`)
  const proxy = sdk.maker.DsProxy.attach(proxyAddress)
  console.log('ILK from gemjoin', await sdk.maker.GemJoin.ilk())

  console.log("encoding", encodeBytes32String("ETH-A"))

  console.log("Open data: ", sdk.maker.ProxyActions.address, sdk.maker.CdpManager.address, ilk, proxy.address, proxyAddress)



  const tx = await proxy["execute(address,bytes)"](
    sdk.maker.ProxyActions.address,
    sdk.maker.ProxyActions.interface.encodeFunctionData("open", [
      sdk.maker.CdpManager.address,
      ilk,
      proxy.address,
    ])
  )
  console.log((await tx.wait()).logs)

  console.log("After open()")
  return (await queryCdps(proxy.address as `0x${string}`))[0]
}

describe("maker", () => {
  describe("deposit", () => {
    let cdp: BigNumber

    beforeAll(async () => {
      cdp = await openMakerCdp({
        ilk: "0x4554482d41000000000000000000000000000000000000000000000000000000",
      })

      console.log("cdpID: ", cdp)
      console.log('applied permissions', await eth.deposit({ avatar: avatar._address as `0x${string}` }))
      await applyPermissions(
        await eth.deposit({ avatar: avatar._address as `0x${string}` })
      )
    })

    it("allows depositing ETH to an existing cdp", async () => {
      const sdk = getMainnetSdk(avatar)
      const proxy = await getProxy()
      console.log('proxy address', proxy.address)
      // eth-sdk config powers different "kits":
      // sdk - doing stuff directly in the name of whatever wallet you init it with
      // testKit - doing stuff through the test roles in the name of the avatar
      // allow - returning permissions to do that call through the test role (allowing the respective testKit... call)

      const ilk = await queryIlk(cdp)
      console.log("Data", sdk.maker.CdpManager.address, ilk.gemJoin, cdp);
      await expect(
        proxy["execute(address,bytes)"](
          sdk.maker.ProxyActions.address,
          sdk.maker.ProxyActions.interface.encodeFunctionData("lockETH", [
            sdk.maker.CdpManager.address,
            ilk.gemJoin,
            cdp,
          ]),
          { value: parseEther("1000") }
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
          { value: parseEther("1000") }
        )
      ).toBeForbidden()
    })
  })
})
