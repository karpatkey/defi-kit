from defi_protocols.functions import *
from defi_protocols.constants import *
from defi_protocols import Aave
from dump import dump

#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# reserves_tokens_data
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def reserves_tokens_data():
    reserves_tokens_data = []
    
    web3 = get_node(ETHEREUM)

    pdp_contract = get_contract(Aave.PDP_ETHEREUM, ETHEREUM, web3=web3, abi=Aave.ABI_PDP)

    reserves_tokens = pdp_contract.functions.getAllReservesTokens().call()
    
    print(len(reserves_tokens))
    i = 1
    for reserve_token in reserves_tokens:
        token_data = {}

        token_data['symbol'] = reserve_token[0]
        token_data['token'] = reserve_token[1]

        token_config = pdp_contract.functions.getReserveConfigurationData(token_data['token']).call()

        token_data['usageAsCollateralEnabled'] = token_config[5]
        token_data['borrowingEnabled'] = token_config[6]
        token_data['stableBorrowRateEnabled'] = token_config[7]
        token_data['isActive'] = token_config[8]
        token_data['isFrozen'] = token_config[9]

        token_addresses = pdp_contract.functions.getReserveTokensAddresses(token_data['token']).call()

        token_data['aTokenAddress'] = token_addresses[0]
        token_data['stableDebtTokenAddress'] = token_addresses[1]
        token_data['variableDebtTokenAddress'] = token_addresses[2]

        reserves_tokens_data.append(token_data)

        print(i)
        i += 1


    dump(reserves_tokens_data, 'aave/v2')


reserves_tokens_data()