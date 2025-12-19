from defabipedia import Chain
from karpatkit.functions import get_contract, get_symbol
from karpatkit.node import get_node
from lib.dump import dump

# Gearbox Address Provider addresses by chain
ADDRESS_PROVIDER = {
    Chain.ETHEREUM: "0xF7f0a609BfAb9a0A98786951ef10e5FE26cC1E38",
}

# Hexa string representing MARKET_CONFIGURATOR_FACTORY key
MARKET_CONFIGURATOR_FACTORY = "0x4d41524b45545f434f4e464947555241544f525f464143544f52590000000000"

# Contract ABIs - minimal required functions only
ADDRESS_PROVIDER_ABI = '[{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"},{"internalType":"uint256","name":"ver","type":"uint256"}],"name":"getAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]'
MARKET_CONFIGURATOR_FACTORY_ABI = '[{"inputs":[],"name":"getMarketConfigurators","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"}]'
MARKET_CONFIGURATOR_ABI = '[{"inputs":[],"name":"curatorName","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}, {"inputs":[],"name":"contractsRegister","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]'
CONTRACTS_REGISTER_ABI = '[{"inputs":[],"name":"getPools","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"}]'
VAULT_ABI = '[{"inputs":[],"name":"asset","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}, {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}, {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}, {"inputs":[],"name":"underlyingToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}, {"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]'

def get_vaults_data(chain):
    """Fetch Gearbox vault data for the specified chain.
    
    Args:
        chain: The blockchain to fetch data from
        
    Returns:
        List of vault dictionaries containing vault metadata
    """
    web3 = get_node(chain)
    result = []

    try:
        # Get the address provider contract
        address_provider_contract = get_contract(
            ADDRESS_PROVIDER[chain], chain, web3=web3, abi=ADDRESS_PROVIDER_ABI
        )
        
        # Get market configurator factory address
        market_configurator_factory = address_provider_contract.functions.getAddress(
            MARKET_CONFIGURATOR_FACTORY, 0
        ).call()
        
        # Get all market configurators
        market_configurator_contract = get_contract(
            market_configurator_factory, chain, web3=web3, abi=MARKET_CONFIGURATOR_FACTORY_ABI
        )
        market_configurators = market_configurator_contract.functions.getMarketConfigurators().call()

        # Process each market configurator
        for market_configurator in market_configurators:
            market_configurator_contract = get_contract(
                market_configurator, chain, web3=web3, abi=MARKET_CONFIGURATOR_ABI
            )
            curator_name = market_configurator_contract.functions.curatorName().call()
            contracts_register = market_configurator_contract.functions.contractsRegister().call()
            
            # Get all vaults from the contracts register
            contracts_register_contract = get_contract(
                contracts_register, chain, web3=web3, abi=CONTRACTS_REGISTER_ABI
            )
            vaults = contracts_register_contract.functions.getPools().call()

            # Process each vault
            for vault in vaults:
                try:
                    vault_contract = get_contract(vault, chain, web3=web3, abi=VAULT_ABI)
                    
                    # Get vault metadata
                    name = vault_contract.functions.name().call()
                    symbol = vault_contract.functions.symbol().call()
                    asset_address = vault_contract.functions.asset().call()
                    underlying_token = vault_contract.functions.underlyingToken().call()
                    version = vault_contract.functions.version().call()
                    
                    # Get token symbols
                    asset_symbol = get_symbol(asset_address, chain, web3)
                    underlying_token_symbol = get_symbol(underlying_token, chain, web3)

                    # Only include vaults with valid name and symbol
                    if name and symbol:
                        result.append({
                            "id": web3.to_checksum_address(vault),
                            "version": version,
                            "name": name,
                            "symbol": symbol,
                            "curator": curator_name,
                            "asset": {
                                "address": web3.to_checksum_address(asset_address),
                                "symbol": asset_symbol
                            },
                            "underlyingToken": {
                                "address": web3.to_checksum_address(underlying_token),
                                "symbol": underlying_token_symbol
                            }
                        })
                except Exception as e:
                    print(f"Error processing vault {vault}: {e}")
                    continue
                    
    except KeyError:
        print(f'Error: Chain {chain} not supported!')
        return []
    except Exception as e:
        print(f"Error fetching vault data: {e}")
        return []
        
    return result
        

def protocol_data(chain):
    """Generate and dump Gearbox protocol data for the specified chain.
    
    Args:
        chain: The blockchain to process
    """
    vaults = get_vaults_data(chain)
    
    # Chain-specific output file suffixes
    suffixes = {
        Chain.ETHEREUM: '_ethInfo.ts',
    }
    
    if chain in suffixes:
        dump(vaults, 'gearbox', suffixes[chain])
    else:
        print(f"Warning: No suffix defined for chain {chain}")


# Process supported chains
if __name__ == "__main__":
    for chain in [Chain.ETHEREUM]:
        protocol_data(chain)