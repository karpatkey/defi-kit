from karpatkit.functions import get_contract, get_symbol, get_node
from defabipedia import Chain
from web3.exceptions import ContractLogicError
from lib.dump import dump

# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# AURA BOOSTER
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Aura Booster (Main Deposit Contract) Address
BOOSTER = "0xA57b8d98dAE62B26Ec3bcC4a365338157060B234"
# Booster Lite for side-chains
BOOSTER_LITE = "0x98Ef32edd24e2c92525E59afc4475C1242a30184"

# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# BALANCER VAULT
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Balancer Vault Contract Address
VAULT = "0xBA12222222228d8Ba445958a75a0704d566BF2C8"

# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# ABIs
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Booster ABI - poolInfo, poolLength
ABI_BOOSTER = '[{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"poolInfo","outputs":[{"internalType":"address","name":"lptoken","type":"address"},{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"gauge","type":"address"},{"internalType":"address","name":"crvRewards","type":"address"},{"internalType":"address","name":"stash","type":"address"},{"internalType":"bool","name":"shutdown","type":"bool"}],"stateMutability":"view","type":"function"}, {"inputs":[],"name":"poolLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]'

# Balancer Vault ABI - getPoolTokens
ABI_VAULT = '[{"inputs":[{"internalType":"bytes32","name":"poolId","type":"bytes32"}],"name":"getPoolTokens","outputs":[{"internalType":"contract IERC20[]","name":"tokens","type":"address[]"},{"internalType":"uint256[]","name":"balances","type":"uint256[]"},{"internalType":"uint256","name":"lastChangeBlock","type":"uint256"}],"stateMutability":"view","type":"function"}]'

# BPT- getPoolId, POOL_ID
ABI_BPT = '[{"inputs":[],"name":"getPoolId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"}, {"inputs":[],"name":"POOL_ID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"}]'


#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# protocol_data
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def protocol_data(blockchain = Chain.ETHEREUM):

    result = []

    web3 = get_node(blockchain)

    if blockchain == Chain.ETHEREUM:
        booster = get_contract(BOOSTER, blockchain, web3=web3)
    else:
        booster = get_contract(BOOSTER_LITE, blockchain, web3=web3)

    for i in range(booster.functions.poolLength().call()):
        
        pool_info = booster.functions.poolInfo(i).call()

        # pool_info[5] = shutdown
        if pool_info[5] == False:

            lptoken_symbol = get_symbol(pool_info[0], blockchain, web3=web3)

            lptoken_contract = get_contract(pool_info[0], blockchain, web3=web3, abi=ABI_BPT)

            try:
                pool_id = lptoken_contract.functions.getPoolId().call()
            except ContractLogicError:
                try:
                    pool_id = lptoken_contract.functions.POOL_ID().call()
                except ContractLogicError:
                    pool_id = None
            
            if pool_id is not None:
                vault_contract = get_contract(VAULT, blockchain, web3=web3, abi=ABI_VAULT)
                pool_tokens = vault_contract.functions.getPoolTokens(pool_id).call()[0]

                tokens = []
                for pool_token in pool_tokens:
                    if pool_token != pool_info[0]:
                        tokens.append(
                            {
                                'address': pool_token,
                                'symbol': get_symbol(pool_token, blockchain, web3=web3)
                            }
                        )
                
                pool_data = {
                    'name': lptoken_symbol,
                    'id': str(i),
                    'bpt': pool_info[0],
                    'tokens': tokens,
                    'rewarder':pool_info[3],
                }

                result.append(pool_data)

    if blockchain == Chain.ETHEREUM:
        dump(result, 'aura', '_ethPools.ts')
    elif blockchain == Chain.GNOSIS:
        dump(result, 'aura', '_gnoPools.ts')
    elif blockchain == Chain.ARBITRUM:
        dump(result, 'aura', '_arb1Pools.ts')
    elif blockchain == Chain.OPTIMISM:
        dump(result, 'aura', '_oethPools.ts')
    elif blockchain == Chain.BASE:
        dump(result, 'aura', '_basePools.ts')

protocol_data()
protocol_data(Chain.GNOSIS)
protocol_data(Chain.ARBITRUM)
protocol_data(Chain.OPTIMISM)
protocol_data(Chain.BASE)