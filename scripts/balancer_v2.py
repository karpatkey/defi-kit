import os
import eth_abi
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
from karpatkit.functions import get_contract, get_symbol, get_decimals, get_node
from karpatkit.constants import Address
from defabipedia import Chain
from lib.dump import dump

VAULT = "0xBA12222222228d8Ba445958a75a0704d566BF2C8"
B_80BAL_20WETH = "0x5c6Ee304399DBdB9C8Ef030aB642B10820DB8F56"

BALANCER_QUERIES = {
    Chain.ETHEREUM: "0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5",
    Chain.GNOSIS: "0x0F3e0c4218b7b0108a3643cFe9D3ec0d4F57c54e",
    Chain.ARBITRUM: "0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5",
    Chain.OPTIMISM: "0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5",
    Chain.BASE: "0x300Ab2038EAc391f26D9F895dc61F8F66a548833",
}

SUBGRAPH_IDS_POOLS = {
    Chain.ETHEREUM: "C4ayEZP2yTXRAB8vSaTrgN4m9anTe9Mdm2ViyiAuV9TV",
    Chain.GNOSIS: "EJezH1Cp31QkKPaBDerhVPRWsKVZLrDfzjrLqpmv6cGg",
    Chain.ARBITRUM: "98cQDy6tufTJtshDCuhh9z2kWXsQWBHVh2bqnLHsGAeS",
    Chain.OPTIMISM: "FsmdxmvBJLGjUQPxKMRtcWKzuCNpomKuMTbSbtRtggZ7",
    Chain.BASE: "E7XyutxXVLrp8njmjF16Hh38PCJuHm12RRyMt5ma4ctX",
}

SUBGRAPH_IDS_GAUGES = {
    Chain.ETHEREUM: "4sESujoqmztX6pbichs4wZ1XXyYrkooMuHA8sKkYxpTn",
    Chain.GNOSIS: "HW5XpZBi2iYDLBqqEEMiRJFx8ZJAQak9uu5TzyH9BBxy",
    Chain.ARBITRUM: "Bb1hVjJZ52kL23chZyyGWJKrGEg3S6euuNa1YA6XRU4J",
    Chain.OPTIMISM: "CbLt7GqU7sypjRaCfwissEBkFeCw3dUz2emrvBNJ7dZu",
    Chain.BASE: "CfBvJNYsbKZdxXzaCtNc6dUbHH6TjDupprjKKo9gnmwg",
}

MIN_TVL = {
    Chain.ETHEREUM: 100,
    Chain.GNOSIS: 0,
    Chain.ARBITRUM: 1000,
    Chain.OPTIMISM: 1000,
    Chain.BASE: 1000,
}

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

def subgraph_query_pools(blockchain):
    result = []
    skip = 0
    batch_size = 1000
    apikey = os.getenv("THE_GRAPH_APIKEY")

    url = f"https://gateway-arbitrum.network.thegraph.com/api/{apikey}/subgraphs/id/{SUBGRAPH_IDS_POOLS[blockchain]}"
    transport = RequestsHTTPTransport(url=url, verify=True, retries=3)
    client = Client(transport=transport)

    while True:
        query = f"""
        query {{
            pools(where: {{totalLiquidity_gte: {MIN_TVL[blockchain]}}}, first: {batch_size}, skip: {skip}) {{
                id
                address
                poolType
                isPaused
                isInRecoveryMode
                tokens {{
                    address
                    symbol
                }}
            }}
        }}
        """
        response = client.execute(gql(query))
        batch = response["pools"]
        result.extend(batch)

        if len(batch) < batch_size:
            break
        skip += batch_size

    return result

def subgraph_query_gauges(blockchain):
    result = []
    skip = 0
    batch_size = 1000
    apikey = os.getenv("THE_GRAPH_APIKEY")

    url = f"https://gateway-arbitrum.network.thegraph.com/api/{apikey}/subgraphs/id/{SUBGRAPH_IDS_GAUGES[blockchain]}"
    transport = RequestsHTTPTransport(url=url, verify=True, retries=3)
    client = Client(transport=transport)

    while True:
        query = f"""
        query {{
            liquidityGauges(where: {{isKilled: false}}, first: {batch_size}, skip: {skip}) {{
                id
                poolAddress
                isPreferentialGauge
            }}
        }}
        """
        response = client.execute(gql(query))
        batch = response["liquidityGauges"]
        result.extend(batch)

        if len(batch) < batch_size:
            break
        skip += batch_size
    
    # prioritize preferential gauge if duplicates exist
    gauge_map = {}
    for gauge in result:
        pool = gauge["poolAddress"]
        current = gauge_map.get(pool)
        if not current or gauge.get("isPreferentialGauge"):
            gauge_map[pool] = gauge

    return list(gauge_map.values())

def is_deprecated(pool_id, lptoken_address, pool_tokens, blockchain, web3):
    amounts = [10**get_decimals(addr, blockchain, web3=web3) for addr in pool_tokens if addr != lptoken_address]

    join_kind = 1  # EXACT_TOKENS_IN_FOR_BPT_OUT
    minimum_bpt = 0
    abi = ['uint256', 'uint256[]', 'uint256']
    data = [join_kind, amounts, minimum_bpt]
    user_data = '0x' + eth_abi.encode(abi, data).hex()

    balancer_queries = get_contract(BALANCER_QUERIES[blockchain], blockchain, abi=ABI_BALANCER_QUERIES)

    try:
        join_pool = balancer_queries.functions.queryJoin(pool_id, Address.ZERO, Address.ZERO, [pool_tokens, amounts, user_data, False]).call()
    except:
        # This is a workaround for some pools, like the Gyroscope ones, that do not yet support EXACT_TOKENS_IN_FOR_BPT_OUT.
        # https://etherscan.io/address/0x3932b187f440cE7703653b3908EDc5bB7676C283#code#F1#L382
        join_kind = 3  # ALL_TOKENS_IN_FOR_EXACT_BPT_OUT
        bpt_amout_out = 1
        abi = ['uint256', 'uint256']
        data = [join_kind, bpt_amout_out]
        user_data = '0x' + eth_abi.encode(abi, data).hex()
        try:
            join_pool = balancer_queries.functions.queryJoin(pool_id, Address.ZERO, Address.ZERO, [pool_tokens, amounts, user_data, False]).call()
        except:
            return True
    
    return join_pool[0] == 0

def unwrap_nested_tokens(lptoken, pool_tokens, pools_dict, token_lookup, web3, blockchain):
    result = []
    for token in pool_tokens:
        if token == lptoken:
            continue
        symbol = token_lookup.get(token, "") or get_symbol(token, blockchain)
        nested_pool = pools_dict.get(token)
        if token == B_80BAL_20WETH and blockchain == Chain.ETHEREUM:
            result.append({"address": token, "symbol": symbol})
        elif nested_pool: #and nested_pool.get("poolType") == "ComposableStable":
            nested_lookup = {web3.to_checksum_address(t['address']): t['symbol'] for t in nested_pool['tokens']}
            nested_tokens = [web3.to_checksum_address(t['address']) for t in nested_pool['tokens']]
            result.extend(unwrap_nested_tokens(token, nested_tokens, pools_dict, nested_lookup, web3, blockchain))
        else:
            result.append({"address": token, "symbol": symbol})
    
    return result

def protocol_data(blockchain):
    result = []
    web3 = get_node(blockchain)
    pools = subgraph_query_pools(blockchain)
    gauges = subgraph_query_gauges(blockchain)
    pools_dict = {web3.to_checksum_address(p['address']): p for p in pools}
    gauges_dict = {
        web3.to_checksum_address(g["poolAddress"]): web3.to_checksum_address(g["id"])
        for g in gauges if g.get("poolAddress")
    }

    for pool in pools:
        if pool['isPaused'] or pool['isInRecoveryMode']:
            continue

        pool_id = pool['id']
        lptoken = web3.to_checksum_address(pool['address'])
        token_lookup = {
            web3.to_checksum_address(t['address']): (
                t['symbol'] if t['symbol'] else get_symbol(web3.to_checksum_address(t['address']), blockchain)
            ) for t in pool['tokens']
        }
        pool_tokens = [web3.to_checksum_address(t['address']) for t in pool['tokens']]

        if is_deprecated(pool_id, lptoken, pool_tokens, blockchain, web3):
            continue

        gauge = gauges_dict.get(lptoken)

        pool_tokens_array = unwrap_nested_tokens(lptoken, pool_tokens, pools_dict, token_lookup, web3, blockchain)

        result.append({
            "bpt": lptoken,
            "id": pool_id,
            "name": get_symbol(lptoken, blockchain),
            "type": pool["poolType"],
            "gauge": gauge,
            "tokens": pool_tokens_array
        })

    suffixes = {
        Chain.ETHEREUM: '_ethPools.ts',
        Chain.GNOSIS: '_gnoPools.ts',
        Chain.ARBITRUM: '_arb1Pools.ts',
        Chain.OPTIMISM: '_oethPools.ts',
        Chain.BASE: '_basePools.ts',
    }
    dump(result, 'balancer/v2', suffixes[blockchain])

for chain in [Chain.ETHEREUM, Chain.GNOSIS, Chain.ARBITRUM, Chain.OPTIMISM, Chain.BASE]:
    protocol_data(chain)