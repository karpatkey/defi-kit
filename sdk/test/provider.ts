import { JsonRpcProvider, TransactionRequest } from "ethers"
import { ANVIL_PORTS } from "./chains"
import { Chain } from "../src"

/**
 * anvil >= 1.x returns the exact minimum gas from `eth_estimateGas` — its
 * binary search has no margin — and ethers sends that estimate verbatim as the
 * tx's gas limit. The simulation runs against the latest block's timestamp,
 * but the mined block can carry a later one, and interest-accrual paths
 * (Aave/Spark `ReserveLogic.updateState`, Maker's `pot.drip()`, reward
 * accrual) are skipped in the simulation and taken when mined. The mined tx
 * then runs out of gas inside the avatar, which returns success=false, and the
 * Roles modifier reports `ModuleTransactionFailed()`.
 *
 * Measured on Spark: 326,685 estimated vs 339,569 needed (+3.9%); on sDAI
 * redeem: 187,220 vs 227,929 (+21.7%). The old CI anvil (0.2.0) happened to
 * return limits with 6-8% headroom, which is why this only appeared on the
 * foundry bump.
 *
 * Nothing here suppresses reverts: `estimateGas` still runs, so `toRevert`,
 * `toBeAllowed` and `toBeForbidden` keep working off estimate-time reverts.
 * Test accounts hold 10,000 ETH, so the larger limit costs nothing.
 */
class TestProvider extends JsonRpcProvider {
  async estimateGas(tx: TransactionRequest): Promise<bigint> {
    return (await super.estimateGas(tx)) * 2n
  }
}

let providers: Map<Chain, JsonRpcProvider> = new Map()

export const getProvider = (chain: Chain) => {
  if (!providers.has(chain)) {
    providers.set(
      chain,
      new TestProvider(`http://127.0.0.1:${ANVIL_PORTS[chain]}`)
    )
  }
  return providers.get(chain)!
}
