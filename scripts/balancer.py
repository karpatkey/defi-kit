import os
from karpatkit.functions import get_contract, get_decimals, get_symbol, get_node
from karpatkit.constants import Address
from defyes.protocols.balancer import get_gauge_addresses
from defabipedia import Chain
# thegraph queries
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
import eth_abi
from lib.dump import dump

# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# BALANCER VAULT
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Balancer Vault Contract Address
VAULT = "0xBA12222222228d8Ba445958a75a0704d566BF2C8"
# B-80BAL-20WETH
B_80BAL_20WETH = "0x5c6Ee304399DBdB9C8Ef030aB642B10820DB8F56"

# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# BALANCER QUERIES
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
BALANCER_QUERIES = {
    Chain.ETHEREUM: "0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5",
    Chain.GNOSIS: "0x0F3e0c4218b7b0108a3643cFe9D3ec0d4F57c54e",
    Chain.ARBITRUM: "0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5",
    Chain.OPTIMISM: "0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5",
    Chain.BASE: "0x300Ab2038EAc391f26D9F895dc61F8F66a548833",
}

# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# BALANCER QUERIES
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
MIN_TVL = {
    Chain.ETHEREUM: 1000,
    Chain.GNOSIS: 100,
    Chain.ARBITRUM: 1000,
    Chain.OPTIMISM: 1000,
    Chain.BASE: 1000,
}

# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# ABIs
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# ABI Balancer Queries - queryExit, queryJoin
ABI_BALANCER_QUERIES = '[{"inputs":[{"internalType":"bytes32","name":"poolId","type":"bytes32"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"components":[{"internalType":"contract IAsset[]","name":"assets","type":"address[]"},{"internalType":"uint256[]","name":"minAmountsOut","type":"uint256[]"},{"internalType":"bytes","name":"userData","type":"bytes"},{"internalType":"bool","name":"toInternalBalance","type":"bool"}],"internalType":"struct IVault.ExitPoolRequest","name":"request","type":"tuple"}],"name":"queryExit","outputs":[{"internalType":"uint256","name":"bptIn","type":"uint256"},{"internalType":"uint256[]","name":"amountsOut","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"}, {"inputs":[{"internalType":"bytes32","name":"poolId","type":"bytes32"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"components":[{"internalType":"contract IAsset[]","name":"assets","type":"address[]"},{"internalType":"uint256[]","name":"maxAmountsIn","type":"uint256[]"},{"internalType":"bytes","name":"userData","type":"bytes"},{"internalType":"bool","name":"fromInternalBalance","type":"bool"}],"internalType":"struct IVault.JoinPoolRequest","name":"request","type":"tuple"}],"name":"queryJoin","outputs":[{"internalType":"uint256","name":"bptOut","type":"uint256"},{"internalType":"uint256[]","name":"amountsIn","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"}]'

# Balancer Vault ABI - getPoolTokens, getPool
ABI_VAULT = '[{"inputs":[{"internalType":"bytes32","name":"poolId","type":"bytes32"}],"name":"getPoolTokens","outputs":[{"internalType":"contract IERC20[]","name":"tokens","type":"address[]"},{"internalType":"uint256[]","name":"balances","type":"uint256[]"},{"internalType":"uint256","name":"lastChangeBlock","type":"uint256"}],"stateMutability":"view","type":"function"}, {"inputs":[{"internalType":"bytes32","name":"poolId","type":"bytes32"}],"name":"getPool","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"enum IVault.PoolSpecialization","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}]'

# BPT ABI - getPoolId, POOL_ID, decimals, getMainToken, version, name
ABI_BPT = '[{"inputs":[],"name":"getPoolId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"}, {"inputs":[],"name":"POOL_ID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"}, {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}, {"inputs":[],"name":"getMainToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}, {"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}, {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]'

# Gauge ABI - is_killed
ABI_GAUGE = '[{"stateMutability":"view","type":"function","name":"is_killed","inputs":[],"outputs":[{"name":"","type":"bool"}]}]'

class PoolNotFoundError(Exception):
    pass

#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# subgraph_query_pools
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def subgraph_query_pools(blockchain):

    result = []
    skip = 0

    the_graph_apikey = os.getenv('THE_GRAPH_APIKEY')
    if blockchain == Chain.ETHEREUM:
        subgraph_url = f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/C4ayEZP2yTXRAB8vSaTrgN4m9anTe9Mdm2ViyiAuV9TV"
    elif blockchain == Chain.GNOSIS:
        subgraph_url = f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/EJezH1Cp31QkKPaBDerhVPRWsKVZLrDfzjrLqpmv6cGg"
    elif blockchain == Chain.ARBITRUM:
        subgraph_url = f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/98cQDy6tufTJtshDCuhh9z2kWXsQWBHVh2bqnLHsGAeS"
    elif blockchain == Chain.OPTIMISM:
        subgraph_url = f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/FsmdxmvBJLGjUQPxKMRtcWKzuCNpomKuMTbSbtRtggZ7"
    elif blockchain == Chain.BASE:
        subgraph_url = f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/E7XyutxXVLrp8njmjF16Hh38PCJuHm12RRyMt5ma4ctX"

    min_tvl = MIN_TVL[blockchain]
    while True:
    # Initialize subgraph
        balancer_transport=RequestsHTTPTransport(
            url=subgraph_url,
            verify=True,
            retries=3
        )
        client = Client(transport=balancer_transport)
        query_string = '''
        query {{
        pools(where: {{totalLiquidity_gte: {min_tvl}}}, first: {first}, skip: {skip}) {{
            id
            address
            poolTypeVersion
            poolType
            isInRecoveryMode
        }}
        }}
        '''
        num_pools_to_query = 1000
        formatted_query_string = query_string.format(first=num_pools_to_query, skip=skip, min_tvl=min_tvl)
        response = client.execute(gql(formatted_query_string))
        result.extend(response['pools'])

        if len(response['pools']) < 1000:
            break
        else:
            skip = 1000

    return result

#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# subgraph_query_gauges
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def subgraph_query_gauges(blockchain):

    result = []
    skip = 0
    the_graph_apikey = os.getenv('THE_GRAPH_APIKEY')
    if blockchain == Chain.ETHEREUM:
        subgraph_url = f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/4sESujoqmztX6pbichs4wZ1XXyYrkooMuHA8sKkYxpTn"
    elif blockchain == Chain.GNOSIS:
        subgraph_url = f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/HW5XpZBi2iYDLBqqEEMiRJFx8ZJAQak9uu5TzyH9BBxy"
    elif blockchain == Chain.ARBITRUM:
        subgraph_url = f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/Bb1hVjJZ52kL23chZyyGWJKrGEg3S6euuNa1YA6XRU4J"
    elif blockchain == Chain.OPTIMISM:
        subgraph_url = f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/CbLt7GqU7sypjRaCfwissEBkFeCw3dUz2emrvBNJ7dZu"
    elif blockchain == Chain.BASE:
        subgraph_url = f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/CfBvJNYsbKZdxXzaCtNc6dUbHH6TjDupprjKKo9gnmwg"


    while True:
    # Initialize subgraph
        balancer_transport=RequestsHTTPTransport(
            url=subgraph_url,
            verify=True,
            retries=3
        )
        client = Client(transport=balancer_transport)
        query_string = '''
        query {{
        gauges(where: {{liquidityGauge_: {{isKilled: false}}}}, first: {first}, skip: {skip}) {{
            address
            liquidityGauge {{
              poolAddress
            }}
        }}
        }}
        '''
        num_pools_to_query = 1000
        formatted_query_string = query_string.format(first=num_pools_to_query, skip=skip)
        response = client.execute(gql(formatted_query_string))
        result.extend(response['gauges'])

        if len(response['gauges']) < 1000:
            break
        else:
            skip = 1000

    return result

#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# is_deprecated
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def is_deprecated(pool_id, lptoken_address, pool_tokens, blockchain, web3):

    amounts = []

    for pool_token in pool_tokens:
        if pool_token != lptoken_address:
            amounts.append(10**get_decimals(pool_token, blockchain, web3=web3))

    join_kind = 1 # EXACT_TOKENS_IN_FOR_BPT_OUT
    minimum_bpt = 0
    abi = ['uint256', 'uint256[]', 'uint256']
    data = [join_kind, amounts, minimum_bpt]
    user_data = '0x' + eth_abi.encode(abi, data).hex()

    balancer_queries = get_contract(BALANCER_QUERIES[blockchain], blockchain, abi=ABI_BALANCER_QUERIES)

    try:
        join_pool = balancer_queries.functions.queryJoin(pool_id, Address.ZERO, Address.ZERO, [pool_tokens, amounts, user_data, False]).call()
    except Exception as e:
        # This is a workaround for some pools, like the Gyroscope ones, that do not yet support EXACT_TOKENS_IN_FOR_BPT_OUT.
        # https://etherscan.io/address/0x3932b187f440cE7703653b3908EDc5bB7676C283#code#F1#L382
        join_kind = 3 # ALL_TOKENS_IN_FOR_EXACT_BPT_OUT
        bpt_amout_out = 1
        abi = ['uint256', 'uint256']
        data = [join_kind, bpt_amout_out]
        user_data = '0x' + eth_abi.encode(abi, data).hex()
        try:
            join_pool = balancer_queries.functions.queryJoin(pool_id, Address.ZERO, Address.ZERO, [pool_tokens, amounts, user_data, False]).call()
        except Exception as e:
            # print(str(e) + ': ' + pool_id)
            return True
    
    if join_pool[0] == 0:
        return True
    else:
        return False

#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# add_pool_tokens
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def add_pool_tokens(pools_dict, vault_contract, pool_id, lptoken_address, pool_tokens_array, blockchain, web3):
    
    pool_tokens_data = vault_contract.functions.getPoolTokens(pool_id).call()
    pool_tokens = pool_tokens_data[0]

    for i in range(len(pool_tokens)):
            
        if pool_tokens[i] == lptoken_address:
            continue

        pool_token_address = pool_tokens[i]
        pool_token_symbol = get_symbol(pool_token_address, blockchain)

        pool_token_contract = get_contract(pool_token_address, blockchain, web3=web3, abi=ABI_BPT)
        try:
            token_pool_id = '0x' + pool_token_contract.functions.getPoolId().call().hex()
        except:
            try:
                token_pool_id = '0x' + pool_token_contract.functions.POOL_ID().call().hex()
            except:
                token_pool_id = '0x'
        
        if token_pool_id != '0x':
            # Particular case of B-80BAL-20WETH on Ethereum
            if pool_token_address == B_80BAL_20WETH and blockchain == Chain.ETHEREUM:
                pool_tokens_array.append({
                'address': pool_token_address,
                'symbol': pool_token_symbol,
                'id': token_pool_id,
                })
            if token_pool_id not in pools_dict:
              raise PoolNotFoundError()   
            if pools_dict[token_pool_id]["poolType"] == 'ComposableStable':
                add_pool_tokens(pools_dict, vault_contract, token_pool_id, pool_token_address, pool_tokens_array, blockchain, web3)
        else:
            pool_tokens_array.append({
                'address': pool_token_address,
                'symbol': pool_token_symbol,
                'id': token_pool_id,
            })

#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# protocol_data
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def protocol_data(blockchain):

    result = []

    web3 = get_node(blockchain)

    pools = subgraph_query_pools(blockchain)
    pools_dict = {pool["id"]: pool for pool in pools}

    gauges = subgraph_query_gauges(blockchain)
    gauges_dict = dict(
    sorted(
            {
                web3.to_checksum_address(gauge["liquidityGauge"]["poolAddress"]): web3.to_checksum_address(gauge["address"])
                for gauge in gauges
                if gauge.get("liquidityGauge") and gauge["liquidityGauge"]["poolAddress"] is not None
            }.items()
        )
    )

    vault_contract = get_contract(VAULT, blockchain, web3=web3, abi=ABI_VAULT)
    
    deprecated = 0
    for pool in pools:
        # Skip pools in recovery mode
        if pool['isInRecoveryMode']:
            continue
        
        lptoken_address = vault_contract.functions.getPool(pool['id']).call()[0]

        pool_tokens_data = vault_contract.functions.getPoolTokens(pool['id']).call()
        pool_tokens = pool_tokens_data[0]

        if is_deprecated(pool['id'], lptoken_address, pool_tokens, blockchain, web3):
            deprecated += 1
            continue

        try:
            gauge_address = gauges_dict[lptoken_address]
        except:
            try:
                gauge_address = get_gauge_addresses(blockchain, 'latest', lptoken_address)[0]
                gauge_contract = get_contract(gauge_address, blockchain, web3=web3, abi=ABI_GAUGE)
                try:
                    if gauge_contract.functions.is_killed().call():
                        gauge_address = None
                except:
                    continue
            except:
                gauge_address = None
        
        pool_name = get_symbol(lptoken_address, blockchain, web3=web3)
        
        pool_tokens_array = []

        try:
            add_pool_tokens(pools_dict, vault_contract, pool['id'], lptoken_address, pool_tokens_array, blockchain, web3)
        except PoolNotFoundError:
            continue
        
        result.append({
            'bpt': lptoken_address,
            'id': pool['id'],
            'name': pool_name, 
            'type': pool['poolType'],
            'gauge': gauge_address,
            'tokens': pool_tokens_array
        })
    
    if blockchain == Chain.ETHEREUM:
        dump(result, 'balancer', '_ethPools.ts')
    elif blockchain == Chain.GNOSIS:
        dump(result, 'balancer', '_gnoPools.ts')
    elif blockchain == Chain.ARBITRUM:
        dump(result, 'balancer', '_arb1Pools.ts')
    elif blockchain == Chain.OPTIMISM:
        dump(result, 'balancer', '_oethPools.ts')
    elif blockchain == Chain.BASE:
        dump(result, 'balancer', '_basePools.ts')

protocol_data(Chain.ETHEREUM)
protocol_data(Chain.GNOSIS)
protocol_data(Chain.ARBITRUM)
protocol_data(Chain.OPTIMISM)
protocol_data(Chain.BASE)

