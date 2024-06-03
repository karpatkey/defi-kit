from defyes.protocols.compound import ABI_CTOKEN
from defyes.functions import get_contract, get_symbol, get_node
from defabipedia import Chain
from karpatkit.constants import Address
from web3.exceptions import BadFunctionCallOutput
from lib.dump import dump

# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# COMPTROLLER
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Ethereum - Comptroller Address
COMPTROLLER = "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B"

# Comptroller ABI - getAllMarkets, mintGuardianPaused
ABI_COMPTROLLER = '[{"constant":true,"inputs":[],"name":"getAllMarkets","outputs":[{"internalType":"contract CToken[]","name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"}, {"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"mintGuardianPaused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]'

# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# ABIs
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# cToken ABI - underlying
ABI_CTOKEN = '[{"constant":true,"inputs":[],"name":"underlying","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]'


#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# markets_data_v2
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def markets_data_v2(blockchain):
    result = []

    web3 = get_node(blockchain)

    comptroller_contract = get_contract(COMPTROLLER, blockchain, web3=web3, abi=ABI_COMPTROLLER)

    markets = comptroller_contract.functions.getAllMarkets().call()

    for ctoken in markets:
        market = {}
        ctoken_contract = get_contract(ctoken, blockchain, web3=web3, abi=ABI_CTOKEN)
        market['cToken'] = ctoken
        try:
            market['token'] = ctoken_contract.functions.underlying().call()
        except BadFunctionCallOutput:
            market['token'] = Address.E
        
        market['symbol'] = get_symbol(market['token'], blockchain, web3=web3)

        market['mint_paused'] = comptroller_contract.functions.mintGuardianPaused(ctoken).call()

        result.append(market)

    dump(result, 'compound/v2')

markets_data_v2(Chain.ETHEREUM)