from defi_protocols.functions import get_node, get_contract, get_symbol
from defi_protocols.constants import ETHEREUM
from defi_protocols import Aura
from defi_protocols import Balancer
from lib.dump import dump


#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# transactions_data
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def transactions_data():

    result = []

    web3 = get_node(ETHEREUM)

    booster = get_contract(Aura.BOOSTER, ETHEREUM, web3=web3)

    for i in range(booster.functions.poolLength().call()):
        
        pool_info = booster.functions.poolInfo(i).call()

        # pool_info[5] = shutdown
        if pool_info[5] == False:

            lptoken_symbol = get_symbol(pool_info[0], ETHEREUM, web3=web3)

            lptoken_data = Balancer.get_lptoken_data(pool_info[0], 'latest', ETHEREUM, web3=web3)
            
            if lptoken_data['poolId'] is not None:
                if lptoken_data['isBoosted'] == False:
                    vault_contract = get_contract(Balancer.VAULT, ETHEREUM, web3=web3, abi=Balancer.ABI_VAULT)
                    pool_tokens = vault_contract.functions.getPoolTokens(lptoken_data['poolId']).call()[0]

                    tokens = []
                    for pool_token in pool_tokens:
                        tokens.append(
                            {
                                'address': pool_token,
                                'symbol': get_symbol(pool_token, ETHEREUM, web3=web3)
                            }
                        )
                    
                    pool_data = {
                        'name': lptoken_symbol,
                        'id': str(i),
                        'bpt': pool_info[0],
                        'tokens': tokens,
                        'rewarder':pool_info[3],
                        # 'shutdown': pool_info[5]
                    }
                
                else:
                    pool_data = {
                        'name': lptoken_symbol,
                        'id': str(i),
                        'bpt': pool_info[0],
                        'tokens': [],
                        'rewarder':pool_info[3],
                        # 'shutdown': pool_info[5]
                    }

                result.append(pool_data)

        print(i)

    dump(result, 'aura')

transactions_data()
