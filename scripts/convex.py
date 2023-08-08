from defi_protocols.functions import get_node, get_contract, get_symbol
from defi_protocols.constants import ETHEREUM
from defi_protocols import Convex
from lib.dump import dump


#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# transactions_data
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def transactions_data():

    result = []

    web3 = get_node(ETHEREUM)

    booster = get_contract(Convex.BOOSTER, ETHEREUM, web3=web3)

    for i in range(booster.functions.poolLength().call()):
        
        pool_info = booster.functions.poolInfo(i).call()

        # pool_info[5] = shutdown
        if pool_info[5] == False:

            lptoken_symbol = get_symbol(pool_info[0], ETHEREUM, web3=web3)
            
            pool_data = {
                'name': lptoken_symbol,
                'id': str(i),
                'crvLPToken': pool_info[0],
                'cvxDepositToken': pool_info[1],
                'rewarder':pool_info[3]
            }

            result.append(pool_data)

            print(i)

    dump(result, 'convex')


transactions_data()