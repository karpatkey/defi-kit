import os
import time
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
from karpatkit.functions import get_node
from defabipedia import Chain
from lib.dump import dump

# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# MINIMUM TVL
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
MIN_TVL = {
    Chain.ETHEREUM: 1_000_000,
    Chain.GNOSIS: 0,
    Chain.ARBITRUM: 1_000_000,
    Chain.OPTIMISM: 1_000_000,
    Chain.BASE: 1_000_000,
}

#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# subgraph_query_all_pools
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def subgraph_query_all_pools(blockchain):

    # Initialize subgraph
    the_graph_apikey = os.getenv('THE_GRAPH_APIKEY')
    if blockchain == Chain.ETHEREUM:
        subgraph_url = f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV"
    elif blockchain == Chain.GNOSIS:
        subgraph_url = f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/Dimv1udMsJu1DqirVM4G2vNRvH8CWzWTn7GffQQCGAaq"
    elif blockchain == Chain.ARBITRUM:
        subgraph_url = f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/FbCGRftH4a3yZugY7TnbYgPJVEv2LvMT6oF1fxPe9aJM"
    elif blockchain == Chain.OPTIMISM:
        subgraph_url = f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/Cghf4LfVqPiFw6fp6Y5X5Ubc8UpmUhSfJL82zwiBFLaj"
    elif blockchain == Chain.BASE:
        subgraph_url = f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/GqzP4Xaehti8KSfQmv3ZctFSjnSUYZ4En5NRsiTbvZpz"


    client = Client(transport=RequestsHTTPTransport(url=subgraph_url, verify=True, retries=3))
    web3 = get_node(blockchain)

    pools = {}
    last_timestamp = 0
    all_found = False

    min_tvl = MIN_TVL[blockchain]
    def fetch_pools(timestamp):
        query_string = f"""
        query {{
            pools(where: {{totalValueLockedUSD_gte: {min_tvl}, volumeUSD_gte: {min_tvl}}}, first: 1000, orderBy: createdAtTimestamp, orderDirection: asc, where: {{ createdAtTimestamp_gt: {timestamp} }}) {{
                id
                token0 {{ id symbol }}
                token1 {{ id symbol }}
                feeTier
                volumeUSD
                totalValueLockedUSD
                createdAtTimestamp
            }}
        }}
        """
        return client.execute(gql(query_string))

    try:
        # Initial query to start fetching pools
        response = fetch_pools(last_timestamp)

        while not all_found:
            for pool in response.get("pools", []):
                volume_usd = float(pool["volumeUSD"])
                tvl_usd = float(pool["totalValueLockedUSD"])

                pools[pool["id"]] = [
                    web3.to_checksum_address(pool["token0"]["id"]),
                    pool["token0"]["symbol"],
                    web3.to_checksum_address(pool["token1"]["id"]),
                    pool["token1"]["symbol"],
                    int(pool["feeTier"]),
                    volume_usd,
                    tvl_usd,
                ]

            if len(response["pools"]) < 1000:
                all_found = True
            else:
                last_timestamp = int(response["pools"][-1]["createdAtTimestamp"]) - 1
                time.sleep(5)  # Prevent hitting rate limits
                response = fetch_pools(last_timestamp)  # Fetch next batch

    except Exception as ex:
        print(ex)

    return pools

#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# protocol_data
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def protocol_data(blockchain, min_tvl_usd=0, min_volume_usd=0):
    
    tokens = []

    pools = subgraph_query_all_pools(blockchain, min_tvl_usd=min_tvl_usd, min_volume_usd=min_volume_usd)

    if pools:
        pools = dict(sorted(pools.items(), key=lambda item: item[1][4], reverse=True))

        for pool in pools.values():
            token0 = {"address": pool[0], "symbol": pool[1]}
            token1 = {"address": pool[2], "symbol": pool[3]}

            if token0 not in tokens:
                tokens.append(token0)
            if token1 not in tokens:
                tokens.append(token1)

    if blockchain == Chain.ETHEREUM:
        dump(tokens, 'uniswap/v3', '_ethInfo.ts')
    elif blockchain == Chain.GNOSIS:
        dump(tokens, 'uniswap/v3', '_gnoInfo.ts')
    elif blockchain == Chain.ARBITRUM:
        dump(tokens, 'uniswap/v3', '_arb1Info.ts')
    elif blockchain == Chain.OPTIMISM:
        dump(tokens, 'uniswap/v3', '_oethInfo.ts')
    elif blockchain == Chain.BASE:
        dump(tokens, 'uniswap/v3', '_baseInfo.ts')


protocol_data(Chain.ETHEREUM)
protocol_data(Chain.GNOSIS)
protocol_data(Chain.ARBITRUM)
protocol_data(Chain.OPTIMISM)
protocol_data(Chain.BASE)