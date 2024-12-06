import os
import time
# thegraph queries
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
from karpatkit.functions import get_node
from defabipedia import Chain
from lib.dump import dump

#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# subgraph_query_all_pools
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def subgraph_query_all_pools(blockchain, min_tvl_usd=0, min_volume_usd=0):

    # Initialize subgraph
    the_graph_apikey = os.getenv('THE_GRAPH_APIKEY')
    # Deprecated endpoint: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"
    subgraph_url = f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV"
    uniswapv3_transport = RequestsHTTPTransport(
        url=subgraph_url, verify=True, retries=3
    )
    client = Client(transport=uniswapv3_transport)

    pools = {}
    response = {}
    last_timestamp = 0
    all_found = False

    web3 = get_node(blockchain)

    try:
        query_string = """
        query {{
        pools(first: 1000, orderBy: createdAtTimestamp, orderDirection: asc) 
            {{
                id
                token0{{id symbol}}
                token1{{id symbol}}
                feeTier
                volumeUSD
                totalValueLockedUSD
                createdAtTimestamp
            }}
        }}
        """

        formatted_query_string = query_string.format()
        response = client.execute(gql(formatted_query_string))

        for pool in response["pools"]:
            volume_usd = float(pool["volumeUSD"])
            tvl_usd = float(pool["totalValueLockedUSD"])

            if volume_usd >= min_volume_usd and tvl_usd >= min_tvl_usd:
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
            last_timestamp = int(pool["createdAtTimestamp"]) - 1

    except Exception as Ex:
        print(Ex)

    if not all_found and last_timestamp > 0:

        try:
            while not all_found:
                query_string = """
                query {{
                pools(first: 1000, orderBy: createdAtTimestamp, orderDirection: asc
                where: {{createdAtTimestamp_gt: {last_timestamp} }})
                    {{
                        id
                        token0{{id symbol}}
                        token1{{id symbol}}
                        feeTier
                        volumeUSD
                        totalValueLockedUSD
                        createdAtTimestamp
                    }}
                }}
                """

                formatted_query_string = query_string.format(
                    last_timestamp=last_timestamp
                )
                response = client.execute(gql(formatted_query_string))

                for pool in response["pools"]:
                    volume_usd = float(pool["volumeUSD"])
                    tvl_usd = float(pool["totalValueLockedUSD"])

                    if volume_usd >= min_volume_usd and tvl_usd >= min_tvl_usd:
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
                    last_timestamp = int(pool["createdAtTimestamp"]) - 1
                    time.sleep(5)

        except Exception as Ex:
            print(Ex)

    return pools

#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# protocol_data
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def protocol_data(blockchain, min_tvl_usd=0, min_volume_usd=0):

    if blockchain == Chain.ETHEREUM:
        tokens = []

    pools = subgraph_query_all_pools(blockchain, min_tvl_usd=min_tvl_usd, min_volume_usd=min_volume_usd)

    if len(pools) > 0:
        pools = dict(sorted(pools.items(), key=lambda item: item[1][4], reverse=True))

        for pool in pools:
            token0 = {
                "address": pools[pool][0],
                "symbol": pools[pool][1],
            }
            if token0 not in tokens:
                tokens.append(token0)
            token1 = {
                "address": pools[pool][2],
                "symbol": pools[pool][3],
            }
            if token1 not in tokens:
                tokens.append(token1)
                      
    if blockchain == Chain.ETHEREUM:
        dump(tokens, 'uniswap/v3', '_ethInfo.ts')


protocol_data(Chain.ETHEREUM, min_tvl_usd=1000000, min_volume_usd=1000000)