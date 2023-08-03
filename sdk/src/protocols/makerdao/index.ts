import { allowErc20Approve } from '../../erc20'
import { contracts } from '../../../eth-sdk/config'
import { allow } from "zodiac-roles-sdk/kit"


export const eth = {
    deposit: () => [
        ...allowErc20Approve(
            [contracts.mainnet.lido.wsteth],
            []
        ),
        allow.mainnet.makerdao.maker_proxy_actions.lockGem()
    ],
    withdraw: () => [
        allow.mainnet.makerdao.maker_proxy_actions.freeGem()
    ],
    join_pot: () => [
        ...allowErc20Approve(
            [contracts.mainnet.lido.wsteth],
            []
        ),
        allow.mainnet.makerdao.pot.join()
    ],
    exit_pot: () => [
        allow.mainnet.makerdao.pot.exit()
    ]
}



