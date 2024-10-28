import { eth } from "."
import { avatar, member } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { testKit } from "../../../test/kit"
import { getMainnetSdk } from "@gnosis-guild/eth-sdk-client"
import { parseEther, parseUnits } from "ethers/lib/utils"

const B_rETH_STABLE_pid =
  "0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112"
const rETH = "0xae78736Cd615f374D3085123A210448E74Fc6393"
const B_USDC_DAI_USDT = "0x79c58f70905F734641735BC61e45c19dD9Ad60bC"
const B_USDC_DAI_USDT_pid =
  "0x79c58f70905f734641735bc61e45c19dd9ad60bc0000000000000000000004e7"
const B_50WETH_50_3pool_pid =
  "0x08775ccb6674d6bdceb0797c364c2653ed84f3840002000000000000000004f0"
const sdk = getMainnetSdk(avatar)

describe("balancer", () => {
  describe("deposit", () => {
    beforeAll(async () => {
      await applyPermissions(
        await eth.deposit({ targets: ["B-rETH-STABLE", "50WETH-50-3pool"] })
      )
    })

    it("only deposit and withdraw from avatar", async () => {
      await sdk.weth.deposit({ value: parseEther("1") })
      await expect(
        testKit.eth.weth.approve(
          contracts.mainnet.balancer.vault,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        testKit.eth.balancer.vault.joinPool(
          B_rETH_STABLE_pid,
          avatar._address,
          avatar._address,
          {
            assets: [rETH, contracts.mainnet.weth],
            maxAmountsIn: [0, parseEther("1")],
            userData:
              "0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de0b6b3a7640000",
            fromInternalBalance: false,
          }
        )
      ).not.toRevert()
      // member address not allowed
      await expect(
        testKit.eth.balancer.vault.joinPool(
          B_rETH_STABLE_pid,
          member._address,
          member._address,
          {
            assets: [rETH, contracts.mainnet.weth],
            maxAmountsIn: [0, parseEther("1")],
            userData:
              "0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de0b6b3a7640000",
            fromInternalBalance: false,
          }
        )
      ).toBeForbidden()
      // pool id not allowed
      await expect(
        testKit.eth.balancer.vault.joinPool(
          "0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014",
          avatar._address,
          avatar._address,
          {
            assets: [rETH, contracts.mainnet.weth],
            maxAmountsIn: [0, parseEther("1")],
            userData:
              "0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de0b6b3a7640000",
            fromInternalBalance: false,
          }
        )
      ).toBeForbidden()

      await expect(
        testKit.eth.balancer.vault.exitPool(
          B_rETH_STABLE_pid,
          avatar._address,
          avatar._address,
          {
            assets: [rETH, contracts.mainnet.weth],
            minAmountsOut: [0, 0],
            userData:
              "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001",
            toInternalBalance: false,
          }
        )
      ).not.toRevert()
      // member address not allowed
      await expect(
        testKit.eth.balancer.vault.exitPool(
          B_rETH_STABLE_pid,
          member._address,
          member._address,
          {
            assets: [rETH, contracts.mainnet.weth],
            minAmountsOut: [0, 0],
            userData:
              "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001",
            toInternalBalance: false,
          }
        )
      ).toBeForbidden()
      // pool id not allowed
      await expect(
        testKit.eth.balancer.vault.exitPool(
          "0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014",
          avatar._address,
          avatar._address,
          {
            assets: [rETH, contracts.mainnet.weth],
            minAmountsOut: [0, 0],
            userData:
              "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001",
            toInternalBalance: false,
          }
        )
      ).toBeForbidden()
    })

    // WARNING: The Relayer permissions tests have been removed as there is
    // no evidence that they are being used for joins or exits.
    //   it("only deposit and withdraw from avatar through relayer", async () => {
    //     await stealErc20(
    //       contracts.mainnet.usdc,
    //       parseUnits("1000", 6),
    //       contracts.mainnet.balancer.vault
    //     )
    //     await expect(
    //       testKit.eth.balancer.vault.setRelayerApproval(
    //         avatar._address,
    //         contracts.mainnet.balancer.relayer,
    //         true
    //       )
    //     ).not.toRevert()
    //     await expect(
    //       testKit.eth.usdc.approve(
    //         contracts.mainnet.balancer.vault,
    //         parseUnits("1000", 6)
    //       )
    //     ).not.toRevert()

    //     await expect(
    //       testKit.eth.balancer.relayer.multicall([
    //         sdk.balancer.relayerLibrary.interface.encodeFunctionData("joinPool", [
    //           B_USDC_DAI_USDT_pid,
    //           0,
    //           avatar._address,
    //           contracts.mainnet.balancer.relayer,
    //           {
    //             assets: [
    //               contracts.mainnet.dai,
    //               B_USDC_DAI_USDT,
    //               contracts.mainnet.usdc,
    //               contracts.mainnet.usdt,
    //             ],
    //             maxAmountsIn: [0, 0, parseUnits("1000", 6), 0],
    //             userData:
    //               "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003b9aca000000000000000000000000000000000000000000000000000000000000000000",
    //             fromInternalBalance: false,
    //           },
    //           0,
    //           84158459389524002386711626555386694745894712975979482213248346579970065170433n,
    //         ]),
    //         sdk.balancer.relayerLibrary.interface.encodeFunctionData("joinPool", [
    //           B_50WETH_50_3pool_pid,
    //           0,
    //           contracts.mainnet.balancer.relayer,
    //           avatar._address,
    //           {
    //             assets: [B_USDC_DAI_USDT, contracts.mainnet.weth],
    //             maxAmountsIn: [
    //               84158459389524002386711626555386694745894712975979482213248346579970065170433n,
    //               0,
    //             ],
    //             userData:
    //               "0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002ba100000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000",
    //             fromInternalBalance: false,
    //           },
    //           0,
    //           84158459389524002386711626555386694745894712975979482213248346579970065170432n,
    //         ]),
    //       ])
    //     ).not.toRevert()
    //     // member address not allowed
    //     await expect(
    //       testKit.eth.balancer.relayer.multicall([
    //         sdk.balancer.relayerLibrary.interface.encodeFunctionData("joinPool", [
    //           B_USDC_DAI_USDT_pid,
    //           0,
    //           member._address,
    //           contracts.mainnet.balancer.relayer,
    //           {
    //             assets: [
    //               contracts.mainnet.dai,
    //               B_USDC_DAI_USDT,
    //               contracts.mainnet.usdc,
    //               contracts.mainnet.usdt,
    //             ],
    //             maxAmountsIn: [0, 0, parseUnits("1000", 6), 0],
    //             userData:
    //               "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003b9aca000000000000000000000000000000000000000000000000000000000000000000",
    //             fromInternalBalance: false,
    //           },
    //           0,
    //           84158459389524002386711626555386694745894712975979482213248346579970065170433n,
    //         ]),
    //         sdk.balancer.relayerLibrary.interface.encodeFunctionData("joinPool", [
    //           B_50WETH_50_3pool_pid,
    //           0,
    //           contracts.mainnet.balancer.relayer,
    //           avatar._address,
    //           {
    //             assets: [B_USDC_DAI_USDT, contracts.mainnet.weth],
    //             maxAmountsIn: [
    //               84158459389524002386711626555386694745894712975979482213248346579970065170433n,
    //               0,
    //             ],
    //             userData:
    //               "0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002ba100000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000",
    //             fromInternalBalance: false,
    //           },
    //           0,
    //           84158459389524002386711626555386694745894712975979482213248346579970065170432n,
    //         ]),
    //       ])
    //     ).toBeForbidden()
    //     // pool id not allowed
    //     await expect(
    //       testKit.eth.balancer.relayer.multicall([
    //         sdk.balancer.relayerLibrary.interface.encodeFunctionData("joinPool", [
    //           B_rETH_STABLE_pid,
    //           0,
    //           avatar._address,
    //           contracts.mainnet.balancer.relayer,
    //           {
    //             assets: [
    //               contracts.mainnet.dai,
    //               B_USDC_DAI_USDT,
    //               contracts.mainnet.usdc,
    //               contracts.mainnet.usdt,
    //             ],
    //             maxAmountsIn: [0, 0, parseUnits("1000", 6), 0],
    //             userData:
    //               "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003b9aca000000000000000000000000000000000000000000000000000000000000000000",
    //             fromInternalBalance: false,
    //           },
    //           0,
    //           84158459389524002386711626555386694745894712975979482213248346579970065170433n,
    //         ]),
    //         sdk.balancer.relayerLibrary.interface.encodeFunctionData("joinPool", [
    //           B_50WETH_50_3pool_pid,
    //           0,
    //           contracts.mainnet.balancer.relayer,
    //           avatar._address,
    //           {
    //             assets: [B_USDC_DAI_USDT, contracts.mainnet.weth],
    //             maxAmountsIn: [
    //               84158459389524002386711626555386694745894712975979482213248346579970065170433n,
    //               0,
    //             ],
    //             userData:
    //               "0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002ba100000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000",
    //             fromInternalBalance: false,
    //           },
    //           0,
    //           84158459389524002386711626555386694745894712975979482213248346579970065170432n,
    //         ]),
    //       ])
    //     ).toBeForbidden()

    //     await expect(
    //       testKit.eth.balancer.relayer.multicall([
    //         sdk.balancer.relayerLibrary.interface.encodeFunctionData("exitPool", [
    //           B_50WETH_50_3pool_pid,
    //           0,
    //           avatar._address,
    //           avatar._address,
    //           {
    //             assets: [B_USDC_DAI_USDT, contracts.mainnet.weth],
    //             minAmountsOut: [0, 0],
    //             userData:
    //               "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000de0b6b3a7640000",
    //             toInternalBalance: false,
    //           },
    //           [
    //             {
    //               index: 0,
    //               key: 84158459389524002386711626555386694745894712975979482213248346579970065170433n,
    //             },
    //             {
    //               index: 1,
    //               key: 84158459389524002386711626555386694745894712975979482213248346579970065170437n,
    //             },
    //           ],
    //         ]),
    //         sdk.balancer.relayerLibrary.interface.encodeFunctionData("exitPool", [
    //           B_USDC_DAI_USDT_pid,
    //           3,
    //           avatar._address,
    //           avatar._address,
    //           {
    //             assets: [
    //               contracts.mainnet.dai,
    //               B_USDC_DAI_USDT,
    //               contracts.mainnet.usdc,
    //               contracts.mainnet.usdt,
    //             ],
    //             minAmountsOut: [0, 0, 0, 0],
    //             userData:
    //               "0x0000000000000000000000000000000000000000000000000000000000000002ba10000000000000000000000000000000000000000000000000000000000001",
    //             toInternalBalance: false,
    //           },
    //           [
    //             {
    //               index: 0,
    //               key: 84158459389524002386711626555386694745894712975979482213248346579970065170434n,
    //             },
    //             {
    //               index: 2,
    //               key: 84158459389524002386711626555386694745894712975979482213248346579970065170435n,
    //             },
    //             {
    //               index: 3,
    //               key: 84158459389524002386711626555386694745894712975979482213248346579970065170436n,
    //             },
    //           ],
    //         ]),
    //       ])
    //     ).not.toRevert()
    //     // member address not allowed
    //     await expect(
    //       testKit.eth.balancer.relayer.multicall([
    //         sdk.balancer.relayerLibrary.interface.encodeFunctionData("exitPool", [
    //           B_50WETH_50_3pool_pid,
    //           0,
    //           member._address,
    //           avatar._address,
    //           {
    //             assets: [B_USDC_DAI_USDT, contracts.mainnet.weth],
    //             minAmountsOut: [0, 0],
    //             userData:
    //               "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000de0b6b3a7640000",
    //             toInternalBalance: false,
    //           },
    //           [
    //             {
    //               index: 0,
    //               key: 84158459389524002386711626555386694745894712975979482213248346579970065170433n,
    //             },
    //             {
    //               index: 1,
    //               key: 84158459389524002386711626555386694745894712975979482213248346579970065170437n,
    //             },
    //           ],
    //         ]),
    //         sdk.balancer.relayerLibrary.interface.encodeFunctionData("exitPool", [
    //           B_USDC_DAI_USDT_pid,
    //           3,
    //           avatar._address,
    //           avatar._address,
    //           {
    //             assets: [
    //               contracts.mainnet.dai,
    //               B_USDC_DAI_USDT,
    //               contracts.mainnet.usdc,
    //               contracts.mainnet.usdt,
    //             ],
    //             minAmountsOut: [0, 0, 0, 0],
    //             userData:
    //               "0x0000000000000000000000000000000000000000000000000000000000000002ba10000000000000000000000000000000000000000000000000000000000001",
    //             toInternalBalance: false,
    //           },
    //           [
    //             {
    //               index: 0,
    //               key: 84158459389524002386711626555386694745894712975979482213248346579970065170434n,
    //             },
    //             {
    //               index: 2,
    //               key: 84158459389524002386711626555386694745894712975979482213248346579970065170435n,
    //             },
    //             {
    //               index: 3,
    //               key: 84158459389524002386711626555386694745894712975979482213248346579970065170436n,
    //             },
    //           ],
    //         ]),
    //       ])
    //     ).toBeForbidden()
    //     // pool id not allowed
    //     await expect(
    //       testKit.eth.balancer.relayer.multicall([
    //         sdk.balancer.relayerLibrary.interface.encodeFunctionData("exitPool", [
    //           B_rETH_STABLE_pid,
    //           0,
    //           avatar._address,
    //           avatar._address,
    //           {
    //             assets: [B_USDC_DAI_USDT, contracts.mainnet.weth],
    //             minAmountsOut: [0, 0],
    //             userData:
    //               "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000de0b6b3a7640000",
    //             toInternalBalance: false,
    //           },
    //           [
    //             {
    //               index: 0,
    //               key: 84158459389524002386711626555386694745894712975979482213248346579970065170433n,
    //             },
    //             {
    //               index: 1,
    //               key: 84158459389524002386711626555386694745894712975979482213248346579970065170437n,
    //             },
    //           ],
    //         ]),
    //         sdk.balancer.relayerLibrary.interface.encodeFunctionData("exitPool", [
    //           B_USDC_DAI_USDT_pid,
    //           3,
    //           avatar._address,
    //           avatar._address,
    //           {
    //             assets: [
    //               contracts.mainnet.dai,
    //               B_USDC_DAI_USDT,
    //               contracts.mainnet.usdc,
    //               contracts.mainnet.usdt,
    //             ],
    //             minAmountsOut: [0, 0, 0, 0],
    //             userData:
    //               "0x0000000000000000000000000000000000000000000000000000000000000002ba10000000000000000000000000000000000000000000000000000000000001",
    //             toInternalBalance: false,
    //           },
    //           [
    //             {
    //               index: 0,
    //               key: 84158459389524002386711626555386694745894712975979482213248346579970065170434n,
    //             },
    //             {
    //               index: 2,
    //               key: 84158459389524002386711626555386694745894712975979482213248346579970065170435n,
    //             },
    //             {
    //               index: 3,
    //               key: 84158459389524002386711626555386694745894712975979482213248346579970065170436n,
    //             },
    //           ],
    //         ]),
    //       ])
    //     ).toBeForbidden()
    //   }, 30000) // Added 30 seconds of timeout because the test takes too long and it fails.
  })
})
