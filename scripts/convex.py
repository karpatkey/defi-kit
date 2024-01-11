from defyes.functions import get_contract, get_symbol, get_node
from karpatkit.constants import Chain
from lib.dump import dump

# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# BOOSTER
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Booster (Main Deposit Contract) Address
BOOSTER = "0xF403C135812408BFbE8713b5A23a04b3D48AAE31"

# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# ABIs
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Booster ABI - poolInfo, poolLength
ABI_BOOSTER = '[{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"poolInfo","outputs":[{"internalType":"address","name":"lptoken","type":"address"},{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"gauge","type":"address"},{"internalType":"address","name":"crvRewards","type":"address"},{"internalType":"address","name":"stash","type":"address"},{"internalType":"bool","name":"shutdown","type":"bool"}],"stateMutability":"view","type":"function"}, {"inputs":[],"name":"poolLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]'


#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# transactions_data
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def transactions_data():

    result = []

    web3 = get_node(Chain.ETHEREUM)

    booster = get_contract(BOOSTER, Chain.ETHEREUM, web3=web3, abi=ABI_BOOSTER)

    for i in range(booster.functions.poolLength().call()):
        
        pool_info = booster.functions.poolInfo(i).call()

        # pool_info[5] = shutdown
        if pool_info[5] == False:

            lptoken_symbol = get_symbol(pool_info[0], Chain.ETHEREUM, web3=web3)
            
            pool_data = {
                'name': lptoken_symbol,
                'id': str(i),
                'crvLPToken': pool_info[0],
                'cvxDepositToken': pool_info[1],
                'rewarder':pool_info[3]
            }

            result.append(pool_data)

    dump(result, 'convex')


transactions_data()