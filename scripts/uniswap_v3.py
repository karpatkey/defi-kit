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
    Chain.ETHEREUM: 100_000,
    Chain.GNOSIS: 0,
    Chain.ARBITRUM: 1_000_000,
    Chain.OPTIMISM: 1_000_000,
    Chain.BASE: 1_000_000,
}

# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# subgraph_query_tokens
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def subgraph_query_tokens(blockchain):

    # Initialize subgraph
    the_graph_apikey = os.getenv('THE_GRAPH_APIKEY')
    subgraph_urls = {
        Chain.ETHEREUM: f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV",
        Chain.GNOSIS: f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/Dimv1udMsJu1DqirVM4G2vNRvH8CWzWTn7GffQQCGAaq",
        Chain.ARBITRUM: f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/FbCGRftH4a3yZugY7TnbYgPJVEv2LvMT6oF1fxPe9aJM",
        Chain.OPTIMISM: f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/Cghf4LfVqPiFw6fp6Y5X5Ubc8UpmUhSfJL82zwiBFLaj",
        Chain.BASE: f"https://gateway-arbitrum.network.thegraph.com/api/{the_graph_apikey}/subgraphs/id/GqzP4Xaehti8KSfQmv3ZctFSjnSUYZ4En5NRsiTbvZpz",
    }

    subgraph_url = subgraph_urls.get(blockchain)
    if not subgraph_url:
        return []

    client = Client(transport=RequestsHTTPTransport(url=subgraph_url, verify=True, retries=3))
    web3 = get_node(blockchain)

    tokens = {}
    last_id = ""  # For pagination
    min_tvl = MIN_TVL[blockchain]
    all_found = False

    def fetch_tokens(last_token_id):
        query_string = f"""
        query {{
            tokens(
                where: {{ totalValueLockedUSD_gte: {min_tvl}, id_gt: "{last_token_id}" }}
                first: 1000
                orderBy: id
                orderDirection: asc
            ) {{
                id
                symbol
                totalValueLockedUSD
            }}
        }}
        """
        return client.execute(gql(query_string))

    try:
        # Initial query to start fetching tokens
        response = fetch_tokens(last_id)

        while not all_found:
            batch = response.get("tokens", [])
            if not batch:
                break

            for token in batch:
                token_address = web3.to_checksum_address(token["id"])
                symbol = token["symbol"]
                tvl_usd = float(token["totalValueLockedUSD"])

                tokens[token_address] = {"address": token_address, "symbol": symbol, "tvl": tvl_usd}

            # Pagination: Get last token ID from the batch
            last_id = batch[-1]["id"]

            # Stop if fewer than 1000 results were returned
            if len(batch) < 1000:
                all_found = True
            else:
                time.sleep(5)  # Prevent hitting rate limits
                response = fetch_tokens(last_id)  # Fetch next batch

    except Exception as ex:
        print(ex)

    # Sort tokens by totalValueLockedUSD in descending order
    sorted_tokens = sorted(tokens.values(), key=lambda t: t["tvl"], reverse=True)

    # Return only address and symbol (excluding TVL)
    return [{"address": t["address"], "symbol": t["symbol"]} for t in sorted_tokens]

# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# protocol_data
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def protocol_data(blockchain):
    tokens = subgraph_query_tokens(blockchain)

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


# Run for all blockchains
protocol_data(Chain.ETHEREUM)
protocol_data(Chain.GNOSIS)
protocol_data(Chain.ARBITRUM)
protocol_data(Chain.OPTIMISM)
protocol_data(Chain.BASE)
