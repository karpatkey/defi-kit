import os
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
from karpatkit.node import get_node
from defabipedia import Chain
from defabipedia.tokens import EthereumTokenAddr
from lib.dump import dump

SUBGRAPH_IDS = {
    Chain.ETHEREUM: "8Lz789DP5VKLXumTMTgygjU2xtuzx8AhbaacgN5PYCAs",
    Chain.ARBITRUM: "XsJn88DNCHJ1kgTqYeTgHMQSK4LuG1LR75339QVeQ26",
    Chain.BASE: "71ZTy1veF9twER9CLMnPWeLQ7GZcwKsjmygejrgKirqs",
}

def subgraph_query_markets(blockchain):
    result = []
    skip = 0
    batch_size = 1000
    apikey = os.getenv("THE_GRAPH_APIKEY")

    url = f"https://gateway-arbitrum.network.thegraph.com/api/{apikey}/subgraphs/id/{SUBGRAPH_IDS[blockchain]}"
    transport = RequestsHTTPTransport(url=url, verify=True, retries=3)
    client = Client(transport=transport)

    while True:
        query = f"""
        query {{
            markets(first: {batch_size}, skip: {skip}, where: {{isActive: true}}, orderBy: totalValueLockedUSD, orderDirection: desc) {{
                id
                name
                irm
                lltv
                oracle {{
                    oracleAddress
                }}
                inputToken {{
                    id
                    symbol
                }}
                borrowedToken {{
                    id     
                    symbol
                }}
            }}
        }}
        """
        response = client.execute(gql(query))
        batch = response["markets"]
        result.extend(batch)

        if len(batch) < batch_size:
            break
        skip += batch_size

    return result

def protocol_data(blockchain):
    markets = subgraph_query_markets(blockchain)
    web3 = get_node(blockchain)
    
    result = []
    for market in markets:
        # Filter out invalid markets
        if (market["id"] == EthereumTokenAddr.ZERO or
            market["irm"] == EthereumTokenAddr.ZERO or
            market["inputToken"]["id"] == EthereumTokenAddr.ZERO or
            market["borrowedToken"]["id"] == EthereumTokenAddr.ZERO):
            continue
            
        result.append({
            "id": market["id"],
            "name": market["name"],
            "irm": web3.to_checksum_address(market["irm"]),
            "lltv": market["lltv"],
            "oracle": web3.to_checksum_address(market["oracle"]["oracleAddress"]),
            "loanToken": {
                "address": web3.to_checksum_address(market["borrowedToken"]["id"]),
                "symbol": market["borrowedToken"]["symbol"]
            },
            "collateralToken": {
                "address": web3.to_checksum_address(market["inputToken"]["id"]),
                "symbol": market["inputToken"]["symbol"]
            }
        })

    suffixes = {
        Chain.ETHEREUM: '_ethInfo.ts',
        Chain.ARBITRUM: '_arb1Info.ts',
        Chain.BASE: '_baseInfo.ts',
    }
    dump(result, 'morpho/markets', suffixes[blockchain])

for chain in [Chain.ETHEREUM, Chain.ARBITRUM, Chain.BASE]:
    protocol_data(chain)