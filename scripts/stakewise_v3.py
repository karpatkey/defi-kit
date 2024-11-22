from defabipedia import Chain
import requests
from lib.dump import dump

#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# subgraph_query_vaults
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def subgraph_query_vaults(blockchain):
    result = []  # To store all fetched vaults
    
    skip = 0     # Start at the beginning
    batch_size = 1000  # Adjust as needed (API usually limits this to 1000 or fewer)

    if blockchain == Chain.ETHEREUM:
        subgraph_url = "https://mainnet-graph.stakewise.io/subgraphs/name/stakewise/stakewise"
    elif blockchain == Chain.GNOSIS:
        subgraph_url = "https://gnosis-graph.stakewise.io/subgraphs/name/stakewise/stakewise"

    while True:
        # GraphQL query with pagination
        query = f"""
        {{
          vaults(orderBy: totalAssets, orderDirection: desc, where: {{ isOsTokenEnabled: true, isPrivate: false, description_not: null }}, first: {batch_size}, skip: {skip}) {{
            description
            displayName
            id
          }}
        }}
        """

        # Send the POST request
        response = requests.post(subgraph_url, json={'query': query})

        # Check for a successful response
        if response.status_code == 200:
            # Parse the JSON response
            data = response.json()
            vaults = data.get('data', {}).get('vaults', [])

            # Append the current batch to the result
            result.extend(vaults)

            # Break the loop if fewer results are returned than the batch size
            if len(vaults) < batch_size:
                break

            # Increment the skip value for the next batch
            skip += batch_size
        else:
            print(f"Query failed with status code {response.status_code}: {response.text}")
            break

    return result


#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# protocol_data
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def protocol_data(blockchain):
    result = []

    vaults = subgraph_query_vaults(blockchain)
    
    # Process the fetched vaults
    for vault in vaults:
        result.append({
            'id': vault['id'],
            'name': vault['displayName'],
            'description': vault['description']
        })

    if blockchain == Chain.ETHEREUM:
        dump(result, 'stakeWise/v3', '_ethPools.ts')
    elif blockchain == Chain.GNOSIS:
        dump(result, 'stakeWise/v3', '_gnoPools.ts')

protocol_data(Chain.ETHEREUM)
protocol_data(Chain.GNOSIS)