import { morpho } from ".";
import { avatar } from "../../../test/wallets";
import { applyPermissions, stealErc20 } from "../../../test/helpers";
import { eth as kit } from "../../../test/kit";
import { parseEther } from "ethers";

// Test constants
const ETHEREUM_BUNDLER = "0x4095F064B8d3c3548A3bebfd0Bbfd04750E30077"; // Bundler address
const METAMORPHO_VAULT = "0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658"; // Vault address
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // WETH token address
const STEAL_ADDRESS = "0x3c22ec75ea5D745c78fc84762F7F1E6D82a2c5BF"; // Address to fund test WETH

describe("Morpho Protocol", () => {
  describe("Deposit Action", () => {
    beforeAll(async () => {
      await applyPermissions(await morpho.deposit({ targets: ["MetaMorpho"] }));
    });

    it("approves and deposits WETH into the vault", async () => {
      const amount = parseEther("10"); // Test with 10 WETH
      await stealErc20(WETH, amount, STEAL_ADDRESS);

      // Approve the vault to spend WETH
      await kit.asAvatar.weth.attach(WETH).approve(METAMORPHO_VAULT, amount);
      await expect(
        kit.asMember.morpho.metaMorpho
          .attach(METAMORPHO_VAULT)
          ["deposit(address,uint256)"](avatar.address, amount)
      ).not.toRevert();
    });

    it("withdraws WETH from the vault", async () => {
      const amount = parseEther("10"); // Test with 10 WETH
      await stealErc20(WETH, amount, STEAL_ADDRESS);

      // Approve and deposit to set up withdrawal
      await kit.asAvatar.weth.attach(WETH).approve(METAMORPHO_VAULT, amount);
      await kit.asMember.morpho.defaultCollateral
        .attach(METAMORPHO_VAULT)
        ["deposit(address,uint256)"](avatar.address, amount);

      // Withdraw WETH
      await expect(
        kit.asMember.morpho.defaultCollateral
          .attach(METAMORPHO_VAULT)
          .withdraw(avatar.address, amount)
      ).not.toRevert();
    });

    it("approves WETH for Ethereum Bundler", async () => {
      const amount = parseEther("10"); // Test with 10 WETH
      await stealErc20(WETH, amount, STEAL_ADDRESS);

      // Approve the Bundler to spend WETH
      await expect(
        kit.asAvatar.weth.attach(WETH).approve(ETHEREUM_BUNDLER, amount)
      ).not.toRevert();
    });
  });
});
