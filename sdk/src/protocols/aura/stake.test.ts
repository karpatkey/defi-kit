import { eth } from "."
import { ZERO_ADDRESS } from "./actions"
import { avatar, member } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { testKit } from "../../../test/kit"
import { parseEther } from "ethers/lib/utils"

const BAL = "0xba100000625a3754423978a60c9317c58a424e3D"
const B_80BAL_20WETH = "0x5c6Ee304399DBdB9C8Ef030aB642B10820DB8F56"
const auraBAL = "0x616e8BfA43F920657B3497DBf40D6b1A02D4608d"

describe("aura", () => {
  describe("stake", () => {
    beforeAll(async () => {
      await applyPermissions(
        await eth.stake({ targets: ["BAL", "B-80BAL-20WETH", "auraBAL"] })
      )
    })
    it("mint auraBAL using BAL, stake and compound", async () => {
      await stealErc20(BAL, parseEther("3"), contracts.mainnet.balancer.vault)
      await expect(
        testKit.eth.usdc
          .attach(BAL)
          .approve(
            contracts.mainnet.aura.bal_depositor_wrapper,
            parseEther("3")
          )
      ).not.toRevert()

      // mint
      await expect(
        testKit.eth.aura.bal_depositor_wrapper.deposit(
          parseEther("1"),
          0,
          true,
          ZERO_ADDRESS
        )
      ).not.toRevert()

      // stake
      await expect(
        testKit.eth.aura.bal_depositor_wrapper.deposit(
          parseEther("1"),
          0,
          true,
          contracts.mainnet.aura.aurabal_staking_rewarder
        )
      ).not.toRevert()
      await expect(
        testKit.eth.aura.aurabal_staking_rewarder["getReward()"]()
      ).not.toRevert()
      await expect(
        testKit.eth.aura.aurabal_staking_rewarder.withdraw(1, true)
      ).not.toRevert()

      // compound
      await expect(
        testKit.eth.aura.bal_depositor_wrapper.deposit(
          parseEther("1"),
          0,
          true,
          contracts.mainnet.aura.aurabal_staker
        )
      ).not.toRevert()
      await expect(
        testKit.eth.aura.aurabal_compounding_rewarder["getReward()"]()
      ).not.toRevert()
      await expect(
        testKit.eth.aura.stkaurabal.withdraw(
          1,
          avatar._address,
          avatar._address
        )
      ).not.toRevert()
      await expect(
        testKit.eth.aura.stkaurabal.withdraw(
          1,
          member._address,
          member._address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    }, 90000) // Added 90 seconds of timeout because the deposit takes too long and the test fails.

    it("mint auraBAL using B-80BAL-20WETH, stake and compound", async () => {
      await stealErc20(
        B_80BAL_20WETH,
        parseEther("3"),
        contracts.mainnet.balancer.vault
      )
      await expect(
        testKit.eth.usdc
          .attach(B_80BAL_20WETH)
          .approve(
            contracts.mainnet.aura.b_80bal_20weth_depositor_wrapper,
            parseEther("3")
          )
      ).not.toRevert()

      // mint
      await expect(
        testKit.eth.aura.b_80bal_20weth_depositor_wrapper[
          "deposit(uint256,bool,address)"
        ](parseEther("1"), true, ZERO_ADDRESS)
      ).not.toRevert()

      // stake
      await expect(
        testKit.eth.aura.b_80bal_20weth_depositor_wrapper[
          "deposit(uint256,bool,address)"
        ](
          parseEther("1"),
          true,
          contracts.mainnet.aura.aurabal_staking_rewarder
        )
      ).not.toRevert()
      await expect(
        testKit.eth.aura.aurabal_staking_rewarder["getReward()"]()
      ).not.toRevert()
      await expect(
        testKit.eth.aura.aurabal_staking_rewarder.withdraw(1, true)
      ).not.toRevert()

      // compound
      await expect(
        testKit.eth.aura.b_80bal_20weth_depositor_wrapper[
          "deposit(uint256,bool,address)"
        ](parseEther("1"), true, contracts.mainnet.aura.aurabal_staker)
      ).not.toRevert()
      await expect(
        testKit.eth.aura.aurabal_compounding_rewarder["getReward()"]()
      ).not.toRevert()
      await expect(
        testKit.eth.aura.stkaurabal.withdraw(
          1,
          avatar._address,
          avatar._address
        )
      ).not.toRevert()
      await expect(
        testKit.eth.aura.stkaurabal.withdraw(
          1,
          member._address,
          member._address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    }, 30000) // Added 30 seconds of timeout because the deposit takes too long and the test fails.

    it("stake and compound auraBAL", async () => {
      await stealErc20(
        auraBAL,
        parseEther("2"),
        contracts.mainnet.balancer.vault
      )
      // For staking
      await expect(
        testKit.eth.usdc
          .attach(auraBAL)
          .approve(
            contracts.mainnet.aura.aurabal_staking_rewarder,
            parseEther("1")
          )
      ).not.toRevert()
      // For compounding
      await expect(
        testKit.eth.usdc
          .attach(auraBAL)
          .approve(contracts.mainnet.aura.stkaurabal, parseEther("1"))
      ).not.toRevert()

      // stake
      await expect(
        testKit.eth.aura.aurabal_staking_rewarder.stake(parseEther("1"))
      ).not.toRevert()

      // compound
      await expect(
        testKit.eth.aura.stkaurabal.deposit(parseEther("1"), avatar._address)
      ).not.toRevert()
      await expect(
        testKit.eth.aura.stkaurabal.deposit(parseEther("1"), member._address)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
