import { eth } from "."
import { ZERO_ADDRESS } from "./actions"
import { avatar, member } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { eth as kit } from "../../../test/kit"
import { parseEther } from "ethers"

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
        kit.asMember.usdc
          .attach(BAL)
          .approve(contracts.mainnet.aura.balDepositorWrapper, parseEther("3"))
      ).not.toRevert()

      // mint
      await expect(
        kit.asMember.aura.balDepositorWrapper.deposit(
          parseEther("1"),
          0,
          true,
          ZERO_ADDRESS
        )
      ).not.toRevert()

      // stake
      await expect(
        kit.asMember.aura.balDepositorWrapper.deposit(
          parseEther("1"),
          0,
          true,
          contracts.mainnet.aura.auraBalStakingRewarder
        )
      ).not.toRevert()
      await expect(
        kit.asMember.aura.auraBalStakingRewarder["getReward()"]()
      ).not.toRevert()
      await expect(
        kit.asMember.aura.auraBalStakingRewarder.withdraw(1, true)
      ).not.toRevert()

      // compound
      await expect(
        kit.asMember.aura.balDepositorWrapper.deposit(
          parseEther("1"),
          0,
          true,
          contracts.mainnet.aura.auraBalStaker
        )
      ).not.toRevert()
      await expect(
        kit.asMember.aura.auraBalCompoundingRewarder["getReward()"]()
      ).not.toRevert()
      await expect(
        kit.asMember.aura.stkauraBal.withdraw(1, avatar.address, avatar.address)
      ).not.toRevert()
      await expect(
        kit.asMember.aura.stkauraBal.withdraw(1, member.address, member.address)
      ).toBeForbidden(Status.ParameterNotAllowed)
    }, 90000) // Added 90 seconds of timeout because the deposit takes too long and the test fails.

    it("mint auraBAL using B-80BAL-20WETH, stake and compound", async () => {
      await stealErc20(
        B_80BAL_20WETH,
        parseEther("3"),
        contracts.mainnet.balancer.vault
      )
      await expect(
        kit.asMember.usdc
          .attach(B_80BAL_20WETH)
          .approve(
            contracts.mainnet.aura.b80Bal20WethDepositorWrapper,
            parseEther("3")
          )
      ).not.toRevert()

      // mint
      await expect(
        kit.asMember.aura.b80Bal20WethDepositorWrapper[
          "deposit(uint256,bool,address)"
        ](parseEther("1"), true, ZERO_ADDRESS)
      ).not.toRevert()

      // stake
      await expect(
        kit.asMember.aura.b80Bal20WethDepositorWrapper[
          "deposit(uint256,bool,address)"
        ](parseEther("1"), true, contracts.mainnet.aura.auraBalStakingRewarder)
      ).not.toRevert()
      await expect(
        kit.asMember.aura.auraBalStakingRewarder["getReward()"]()
      ).not.toRevert()

      console.log("BEFORE")
      await kit.asAvatar.aura.auraBalStakingRewarder.withdraw(1, true)
      console.log("AFTER")
      await expect(
        kit.asMember.aura.auraBalStakingRewarder.withdraw(1, true)
      ).not.toRevert()

      // compound
      await expect(
        kit.asMember.aura.b80Bal20WethDepositorWrapper[
          "deposit(uint256,bool,address)"
        ](parseEther("1"), true, contracts.mainnet.aura.auraBalStaker)
      ).not.toRevert()
      await expect(
        kit.asMember.aura.auraBalCompoundingRewarder["getReward()"]()
      ).not.toRevert()
      await expect(
        kit.asMember.aura.stkauraBal.withdraw(1, avatar.address, avatar.address)
      ).not.toRevert()
      await expect(
        kit.asMember.aura.stkauraBal.withdraw(1, member.address, member.address)
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
        kit.asMember.usdc
          .attach(auraBAL)
          .approve(
            contracts.mainnet.aura.auraBalStakingRewarder,
            parseEther("1")
          )
      ).not.toRevert()
      // For compounding
      await expect(
        kit.asMember.usdc
          .attach(auraBAL)
          .approve(contracts.mainnet.aura.stkauraBal, parseEther("1"))
      ).not.toRevert()

      // stake
      await expect(
        kit.asMember.aura.auraBalStakingRewarder.stake(parseEther("1"))
      ).not.toRevert()

      // compound
      await expect(
        kit.asMember.aura.stkauraBal.deposit(parseEther("1"), avatar.address)
      ).not.toRevert()
      await expect(
        kit.asMember.aura.stkauraBal.deposit(parseEther("1"), member.address)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
