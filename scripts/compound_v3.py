from defyes.functions import get_contract, get_symbol
from defyes.node import get_node
from defyes.constants import Chain, Address
from lib.dump import dump

COMETS = [
    {
        'address': '0xc3d688B66703497DAA19211EEdff47f25384cdc3',
        'symbol': 'cUSDCv3'
    },
    {
        'address': '0xA17581A9E3356d9A858b789D68B4d866e593aE94',
        'symbol': 'cWETHv3'
    }
]

# numAssets, getAssetInfo, baseToken
ABI_COMET = '[{"inputs":[],"name":"numAssets","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}, {"inputs":[{"internalType":"uint8","name":"i","type":"uint8"}],"name":"getAssetInfo","outputs":[{"components":[{"internalType":"uint8","name":"offset","type":"uint8"},{"internalType":"address","name":"asset","type":"address"},{"internalType":"address","name":"priceFeed","type":"address"},{"internalType":"uint64","name":"scale","type":"uint64"},{"internalType":"uint64","name":"borrowCollateralFactor","type":"uint64"},{"internalType":"uint64","name":"liquidateCollateralFactor","type":"uint64"},{"internalType":"uint64","name":"liquidationFactor","type":"uint64"},{"internalType":"uint128","name":"supplyCap","type":"uint128"}],"internalType":"struct CometCore.AssetInfo","name":"","type":"tuple"}],"stateMutability":"view","type":"function"}, {"inputs":[],"name":"baseToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]'


#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# markets_data_v3
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def markets_data_v3(blockchain):
    result = []

    web3 = get_node(blockchain)

    for comet in COMETS:
        comet_contract = get_contract(comet['address'], blockchain, web3=web3, abi=ABI_COMET)
        comet_data = {}
        comet_data['address'] = comet['address']
        comet_data['symbol'] = comet['symbol']
        base_token = comet_contract.functions.baseToken().call()
        base_token_symbol = get_symbol(base_token, blockchain, web3=web3)
        
        if base_token_symbol == 'WETH':
            comet_data['borrowToken'] = {
                'address': Address.E,
                'symbol': 'ETH'
            }
        else:
            comet_data['borrowToken'] = {
                'address': base_token,
                'symbol': base_token_symbol
            }

        comet_data['collateralTokens'] = []

        markets_len = comet_contract.functions.numAssets().call()

        for i in range(markets_len):
            market = {}

            market['address'] = comet_contract.functions.getAssetInfo(i).call()[1]
            market['symbol'] = get_symbol(market['address'], blockchain, web3=web3)

            if market['symbol'] == 'WETH':
                market['address'] = Address.E
                market['symbol'] = 'ETH'

            comet_data['collateralTokens'].append(market)
        
        result.append(comet_data)

    dump(result, 'compound/v3')

markets_data_v3(Chain.ETHEREUM)