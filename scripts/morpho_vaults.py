from defabipedia import Chain
from karpatkit.functions import get_logs_web3, get_contract, get_symbol
from karpatkit.node import get_node
from lib.dump import dump
import json

VAULT_V1_FACTORY = {
    Chain.ETHEREUM: {
        "address": "0xA9c3D3a366466Fa809d1Ae982Fb2c46E5fC41101",
        "fromBlock": 18925584

    },
    Chain.BASE: {
        "address": "0xA9c3D3a366466Fa809d1Ae982Fb2c46E5fC41101",
        "fromBlock": 13978134
    }
}

VAULT_V1_1_FACTORY = {
  Chain.ETHEREUM: {
    "address": "0x1897A8997241C1cD4bD0698647e4EB7213535c24",
    "fromBlock": 21439510
  },
  Chain.ARBITRUM: {
    "address": "0x878988f5f561081deEa117717052164ea1Ef0c82",
    "fromBlock": 296447195
  },
  Chain.BASE: {
    "address": "0xFf62A7c278C62eD665133147129245053Bbf5918",
    "fromBlock": 23928808
  }
}

# keccak256 of CreateMetaMorpho(address,address,address,uint256,address,string,string,bytes32) - Topic[0]
CreateMetaMorpho = "0xed8c95d05909b0f217f3e68171ef917df4b278d5addfe4dda888e90279be7d1d"

VAULT_V2_FACTORY = {
  Chain.ETHEREUM: {
    "address": "0xA1D94F746dEfa1928926b84fB2596c06926C0405",
    "fromBlock": 23375073
  },
  Chain.ARBITRUM: {
    "address": "0x6b46fa3cc9EBF8aB230aBAc664E37F2966Bf7971",
    "fromBlock": 387016724
  },
  Chain.BASE: {
    "address": "0x4501125508079A99ebBebCE205DeC9593C2b5857",
    "fromBlock": 35615206
  }
}

# keccak256 of CreateVaultV2(address,address,bytes32,address) - Topic[0]
CreateVaultV2 = "0x341ce009267aa0d78cc12b34155e223904a51ed49d144beb6eb8be87813edb4e"

# Morpho Vault ABI - asset, name, symbol
VAULT_ABI = json.loads('[{"inputs":[],"name":"asset","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}, {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}, {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]')

def get_vaults_data(chain):
    web3 = get_node(chain)
    result = []
    
    # Get V1 vaults
    if chain in VAULT_V1_FACTORY:
        factory_info = VAULT_V1_FACTORY[chain]
        logs = get_logs_web3(
            blockchain=chain,
            address=factory_info["address"],
            block_start=factory_info["fromBlock"],
            block_end="latest",
            topics=[CreateMetaMorpho],
            web3=web3,
        )
        
        for log in logs:
            vault_address = "0x" + log["topics"][1].hex()[26:]  # topic 1, remove 0x and first 24 chars
            vault_contract = get_contract(vault_address, chain, web3, abi=VAULT_ABI)
            
            try:
                name = vault_contract.functions.name().call()
                symbol = vault_contract.functions.symbol().call()
                asset_address = vault_contract.functions.asset().call()
                asset_symbol = get_symbol(asset_address, chain, web3)
                
                if name and symbol:  # Filter out vaults with empty name or symbol
                    result.append({
                        "id": web3.to_checksum_address(vault_address),
                        "version": "v1",
                        "name": name,
                        "symbol": symbol,
                        "asset": {
                            "address": web3.to_checksum_address(asset_address),
                            "symbol": asset_symbol
                        }
                    })
            except Exception as e:
                print(f"Error processing V1 vault {vault_address}: {e}")
    
    # Get V1.1 vaults
    if chain in VAULT_V1_1_FACTORY:
        factory_info = VAULT_V1_1_FACTORY[chain]
        logs = get_logs_web3(
            blockchain=chain,
            address=factory_info["address"],
            block_start=factory_info["fromBlock"],
            block_end="latest",
            topics=[CreateMetaMorpho],
            web3=web3,
        )
        
        for log in logs:
            vault_address = "0x" + log["topics"][1].hex()[26:]  # topic 1, remove 0x and first 24 chars
            vault_contract = get_contract(vault_address, chain, web3, abi=VAULT_ABI)
            
            try:
                name = vault_contract.functions.name().call()
                symbol = vault_contract.functions.symbol().call()
                asset_address = vault_contract.functions.asset().call()
                asset_symbol = get_symbol(asset_address, chain, web3)
                
                if name and symbol:  # Filter out vaults with empty name or symbol
                    result.append({
                        "id": web3.to_checksum_address(vault_address),
                        "version": "v1.1",
                        "name": name,
                        "symbol": symbol,
                        "asset": {
                            "address": web3.to_checksum_address(asset_address),
                            "symbol": asset_symbol
                        }
                    })
            except Exception as e:
                print(f"Error processing V1.1 vault {vault_address}: {e}")
    
    # Get V2 vaults
    if chain in VAULT_V2_FACTORY:
        factory_info = VAULT_V2_FACTORY[chain]
        logs = get_logs_web3(
            blockchain=chain,
            address=factory_info["address"],
            block_start=factory_info["fromBlock"],
            block_end="latest",
            topics=[CreateVaultV2],
            web3=web3,
        )
        
        for log in logs:
            vault_address = "0x" + log["topics"][3].hex()[26:]  # topic 3, remove 0x and first 24 chars
            vault_contract = get_contract(vault_address, chain, web3, abi=VAULT_ABI)
            
            try:
                name = vault_contract.functions.name().call()
                symbol = vault_contract.functions.symbol().call()
                asset_address = vault_contract.functions.asset().call()
                asset_symbol = get_symbol(asset_address, chain, web3)
                
                if name and symbol:  # Filter out vaults with empty name or symbol
                    result.append({
                        "id": web3.to_checksum_address(vault_address),
                        "version": "v2",
                        "name": name,
                        "symbol": symbol,
                        "asset": {
                            "address": web3.to_checksum_address(asset_address),
                            "symbol": asset_symbol
                        }
                    })
            except Exception as e:
                print(f"Error processing V2 vault {vault_address}: {e}")
    
    return result

def protocol_data(chain):
    vaults = get_vaults_data(chain)
    
    suffixes = {
        Chain.ETHEREUM: '_ethInfo.ts',
        Chain.ARBITRUM: '_arb1Info.ts',
        Chain.BASE: '_baseInfo.ts',
    }
    
    dump(vaults, 'morpho/vaults', suffixes[chain])

for chain in [Chain.ETHEREUM, Chain.ARBITRUM, Chain.BASE]:
    protocol_data(chain)