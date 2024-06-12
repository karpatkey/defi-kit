from defyes.functions import get_contract, get_symbol, get_node
from defabipedia import Chain
from lib.dump import dump
import requests

# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# ABIs
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Gem Join - gem, ilk
ABI_GEM_JOIN = '[{"constant":true,"inputs":[],"name":"gem","outputs":[{"internalType":"contract GemLike","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ilk","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"}]'


#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# transactions_data
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def transactions_data():
    chainlog_data = requests.get("https://chainlog.makerdao.com/api/mainnet/active.json").json()

    web3 = get_node(Chain.ETHEREUM)
    result = []
    for item in chainlog_data:
        if 'MCD_JOIN' in item and item not in ['MCD_JOIN_DAI', 'MCD_JOIN_TELEPORT_FW_A']:
            gem_join_contract = get_contract(chainlog_data[item], Chain.ETHEREUM, web3=web3, abi=ABI_GEM_JOIN)
            gem_address = gem_join_contract.functions.gem().call()
            result.append(
                {
                    'address': gem_address,
                    'symbol': get_symbol(gem_address, Chain.ETHEREUM, web3=web3),
                    'gemJoin': gem_join_contract.address,
                    'ilkDescription': item[9:len(item)],
                    'ilk': '0x' + gem_join_contract.functions.ilk().call().hex()
                }
            )
    
    dump(result, 'maker')

transactions_data()