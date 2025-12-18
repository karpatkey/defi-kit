from karpatkit.functions import get_contract, get_node
from defabipedia import Chain, tokens
from lib.dump import dump
import os
import sys
lib_path = os.path.abspath(os.path.join(__file__, '..'))
sys.path.append(lib_path)

PROTOCOL_DATA_PROVIDER = {
    Chain.ETHEREUM: {
        'v2': '0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d',
        'v3': {
            'Core': '0x0a16f2FCC0D44FaE41cc54e079281D84A363bECD',
            'Prime': '0xB85B2bFEbeC4F5f401dbf92ac147A3076391fCD5',
            'EtherFi': '0x7c8509591f9693D21280d96e149a08A3bf69Cd0c',
        }
    },
    Chain.GNOSIS: {
        'v3': {
          'Core': '0xF1F5acB596568895393cB5E4D0452D6592A2fA70',
        }
    },
    Chain.ARBITRUM: {
        'v3': {
          'Core': '0x243Aa95cAC2a25651eda86e80bEe66114413c43b',
        }
    },
    Chain.OPTIMISM: {
        'v3': {
          'Core': '0x243Aa95cAC2a25651eda86e80bEe66114413c43b',
        }
    },
    Chain.BASE: {
        'v3': {
          'Core': '0x0F43731EB8d45A581f4a36DD74F5f358bc90C73A',
        }
    }
}

# Protocol Data Provider ABI - getAllReservesTokens, getUserReserveData, getReserveConfigurationData, getReserveTokensAddresses
ABI_PDP = '[{"inputs":[],"name":"getAllReservesTokens","outputs":[{"components":[{"internalType":"string","name":"symbol","type":"string"},{"internalType":"address","name":"tokenAddress","type":"address"}],"internalType":"struct AaveProtocolDataProvider.TokenData[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"}, {"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"address","name":"user","type":"address"}],"name":"getUserReserveData","outputs":[{"internalType":"uint256","name":"currentATokenBalance","type":"uint256"},{"internalType":"uint256","name":"currentStableDebt","type":"uint256"},{"internalType":"uint256","name":"currentVariableDebt","type":"uint256"},{"internalType":"uint256","name":"principalStableDebt","type":"uint256"},{"internalType":"uint256","name":"scaledVariableDebt","type":"uint256"},{"internalType":"uint256","name":"stableBorrowRate","type":"uint256"},{"internalType":"uint256","name":"liquidityRate","type":"uint256"},{"internalType":"uint40","name":"stableRateLastUpdated","type":"uint40"},{"internalType":"bool","name":"usageAsCollateralEnabled","type":"bool"}],"stateMutability":"view","type":"function"}, {"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getReserveConfigurationData","outputs":[{"internalType":"uint256","name":"decimals","type":"uint256"},{"internalType":"uint256","name":"ltv","type":"uint256"},{"internalType":"uint256","name":"liquidationThreshold","type":"uint256"},{"internalType":"uint256","name":"liquidationBonus","type":"uint256"},{"internalType":"uint256","name":"reserveFactor","type":"uint256"},{"internalType":"bool","name":"usageAsCollateralEnabled","type":"bool"},{"internalType":"bool","name":"borrowingEnabled","type":"bool"},{"internalType":"bool","name":"stableBorrowRateEnabled","type":"bool"},{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"bool","name":"isFrozen","type":"bool"}],"stateMutability":"view","type":"function"}, {"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getReserveTokensAddresses","outputs":[{"internalType":"address","name":"aTokenAddress","type":"address"},{"internalType":"address","name":"stableDebtTokenAddress","type":"address"},{"internalType":"address","name":"variableDebtTokenAddress","type":"address"}],"stateMutability":"view","type":"function"}]'

def reserves_tokens_data(chain, version=3, market='Core'):
    reserves_tokens_data = []
    
    web3 = get_node(chain)

    try:
        if version == 3:
            pdp_address = PROTOCOL_DATA_PROVIDER[chain]['v' + str(version)][market]
        else:
            pdp_address = PROTOCOL_DATA_PROVIDER[chain]['v' + str(version)]
        pdp_contract = get_contract(pdp_address, chain, web3=web3, abi=ABI_PDP)
    except KeyError:
        return 'Error: wrong chain or version!'

    reserves_tokens = pdp_contract.functions.getAllReservesTokens().call()
    
    for reserve_token in reserves_tokens:
        token_data = {}

        if chain == Chain.ARBITRUM and reserve_token[1] == tokens.ArbitrumTokenAddr.USDCe:
            token_data['symbol'] = 'USDC.e'
        elif chain == Chain.OPTIMISM and reserve_token[1] == tokens.OptimismTokenAddr.USDCe:
            token_data['symbol'] = 'USDC.e'
        else:
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
        token_data['variableDebtTokenAddress'] = token_addresses[2]

        reserves_tokens_data.append(token_data)

    if chain == Chain.ETHEREUM:
        dump(reserves_tokens_data, f'aave/v{version}', f'_eth{market}Info.ts')
    elif chain == Chain.GNOSIS:
        dump(reserves_tokens_data, f'aave/v{version}', f'_gno{market}Info.ts')
    elif chain == Chain.ARBITRUM:
        dump(reserves_tokens_data, f'aave/v{version}', f'_arb1{market}Info.ts')
    elif chain == Chain.OPTIMISM:
        dump(reserves_tokens_data, f'aave/v{version}', f'_oeth{market}Info.ts')
    elif chain == Chain.BASE:
        dump(reserves_tokens_data, f'aave/v{version}', f'_base{market}Info.ts')

