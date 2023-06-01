import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve } from "../../erc20"

const STETH = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
const WSTETH = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"

export const eth = {
  deposit: () => [
    // { targetAddress: WSTETH, signature: "wrap(uint256)" },
    // { targetAddress: WSTETH, signature: "unwrap(uint256)" },
    // {
    // targetAddress: STETH,
    // signature: "submit(address)",
    // send: true,
    // },
    allow.mainnet.lido.wsteth.wrap(),
    allow.mainnet.lido.wsteth.unwrap(),
    allow.mainnet.lido.steth.submit(undefined, { send: true }),
    ...allowErc20Approve([STETH], [WSTETH]),
  ],
}
