import { eth } from "."
import { avatar } from "../../../test/wallets"
import { applyPermissions } from "../../../test/helpers"
import { queryCdps, queryIlk, queryProxy } from "./utils"
import { ZeroAddress, encodeBytes32String, parseEther } from "ethers"
import { eth as kit } from "../../../test/kit"

const getProxy = async () => {
  const proxyAddress = await queryProxy(avatar.address as `0x${string}`)
  console.log({ proxyAddress, avatar: avatar.address })
  const proxy = kit.asMember.maker.DsProxy.attach(proxyAddress)
  return proxy
}

const openMakerCdp = async ({ ilk }: { ilk: string }) => {
  // build proxy if it doesn't exist yet
  if ((await queryProxy(avatar.address as `0x${string}`)) === ZeroAddress) {
    await kit.asAvatar.maker.ProxyRegistry["build()"]()
  }

  const proxyAddress = await queryProxy(avatar.address as `0x${string}`)
  const proxy = kit.asAvatar.maker.DsProxy.attach(proxyAddress)
  console.log("ILK from gemjoin", await kit.asAvatar.maker.GemJoin.ilk())

  console.log("encoding", encodeBytes32String("ETH-A"))

  console.log(
    "Open data: ",
    await kit.asAvatar.maker.ProxyActions.getAddress(),
    await kit.asAvatar.maker.CdpManager.getAddress(),
    ilk,
    await proxy.getAddress(),
    proxyAddress
  )

  const tx = await proxy["execute(address,bytes)"](
    await kit.asAvatar.maker.ProxyActions.getAddress(),
    kit.asAvatar.maker.ProxyActions.interface.encodeFunctionData("open", [
      await kit.asAvatar.maker.CdpManager.getAddress(),
      ilk,
      await proxy.getAddress(),
    ])
  )
  console.log((await tx.wait())!.logs)

  console.log("After open()")
  return (await queryCdps((await proxy.getAddress()) as `0x${string}`))[0]
}

describe("maker", () => {
  describe("deposit", () => {
    let cdp: bigint

    beforeAll(async () => {
      cdp = await openMakerCdp({
        ilk: "0x4554482d41000000000000000000000000000000000000000000000000000000",
      })

      console.log("cdpID: ", cdp)
      console.log(
        "applied permissions",
        await eth.deposit({ avatar: avatar.address as `0x${string}` })
      )
      await applyPermissions(
        await eth.deposit({ avatar: avatar.address as `0x${string}` })
      )
    })

    it("allows depositing ETH to an existing cdp", async () => {
      const proxy = await getProxy()
      console.log("proxy address", await proxy.getAddress())
      // eth-sdk config powers different "kits":
      // sdk - doing stuff directly in the name of whatever wallet you init it with
      // testKit - doing stuff through the test roles in the name of the avatar
      // allow - returning permissions to do that call through the test role (allowing the respective testKit... call)

      const ilk = await queryIlk(cdp)
      console.log(
        "Data",
        await kit.asAvatar.maker.CdpManager.getAddress(),
        ilk.gemJoin,
        cdp
      )
      await expect(
        proxy["execute(address,bytes)"](
          await kit.asAvatar.maker.ProxyActions.getAddress(),
          kit.asAvatar.maker.ProxyActions.interface.encodeFunctionData(
            "lockETH",
            [await kit.asAvatar.maker.CdpManager.getAddress(), ilk.gemJoin, cdp]
          ),
          { value: parseEther("1000") }
        )
      ).not.toRevert()

      // make sure permissions really only allow to lock to our own CDPs
      await expect(
        proxy["execute(address,bytes)"](
          await kit.asAvatar.maker.ProxyActions.getAddress(),
          kit.asAvatar.maker.ProxyActions.interface.encodeFunctionData(
            "lockETH",
            [await kit.asAvatar.maker.CdpManager.getAddress(), ilk.gemJoin, 123]
          ),
          { value: parseEther("1000") }
        )
      ).toBeForbidden()
    })
  })
})
