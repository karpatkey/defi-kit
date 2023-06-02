import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve } from "../../erc20"
import { contracts } from "../../../eth-sdk/config"

export const eth = {
  deposit: () => [
    allow.mainnet.lido.wsteth.wrap(),
    allow.mainnet.lido.wsteth.unwrap(),
    allow.mainnet.lido.steth.submit(undefined, { send: true }),
    ...allowErc20Approve(
      [contracts.mainnet.lido.steth],
      [contracts.mainnet.lido.wsteth]
    ),
  ],
}
