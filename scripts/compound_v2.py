from defi_protocols.Compound import ABI_CTOKEN, get_comptoller_address
from defi_protocols.functions import get_contract, get_symbol, get_node
from defi_protocols.constants import ETHEREUM, E_ADDRESS
from web3.exceptions import BadFunctionCallOutput
from lib.dump import dump

# Comptroller ABI - getAllMarkets, mintGuardianPaused
ABI_COMPTROLLER = '[{"constant":true,"inputs":[],"name":"getAllMarkets","outputs":[{"internalType":"contract CToken[]","name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"}, {"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"mintGuardianPaused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]'

#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# markets_data_v2
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def markets_data_v2(blockchain):
    result = []

    web3 = get_node(blockchain)

    comptroller_address = get_comptoller_address(blockchain)
    comptroller_contract = get_contract(comptroller_address, blockchain, web3=web3, abi=ABI_COMPTROLLER)

    markets = comptroller_contract.functions.getAllMarkets().call()

    print(len(markets))
    i = 1
    for ctoken in markets:
        market = {}
        ctoken_contract = get_contract(ctoken, blockchain, web3=web3, abi=ABI_CTOKEN)
        market['cToken'] = ctoken
        try:
            market['token'] = ctoken_contract.functions.underlying().call()
        except BadFunctionCallOutput:
            market['token'] = E_ADDRESS
        
        market['symbol'] = get_symbol(market['token'], blockchain, web3=web3)
        market['mint_paused'] = comptroller_contract.functions.mintGuardianPaused(ctoken).call()

        result.append(market)

        print(i)
        i+=1

    dump(result, 'compound/v2')

markets_data_v2(ETHEREUM)