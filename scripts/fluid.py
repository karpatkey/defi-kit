from karpatkit.functions import get_contract, get_symbol, get_node
from defabipedia import Chain
from lib.dump import dump


LENDING_RESOLVER = {
  Chain.ETHEREUM: "0xC215485C572365AE87f908ad35233EC2572A3BEC",
  Chain.ARBITRUM: "0xdF4d3272FfAE8036d9a2E1626Df2Db5863b4b302",
  Chain.BASE: "0x3aF6FBEc4a2FE517F56E402C65e3f4c3e18C1D86"
}

# ABI for the Lending Resolver contract - getAllFTokens, getFTokenDetails
ABI_LENDING_RESOLVER = '[{"inputs":[],"name":"getAllFTokens","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"}, {"inputs":[{"internalType":"contract IFToken","name":"fToken_","type":"address"}],"name":"getFTokenDetails","outputs":[{"components":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"bool","name":"eip2612Deposits","type":"bool"},{"internalType":"bool","name":"isNativeUnderlying","type":"bool"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint256","name":"decimals","type":"uint256"},{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"totalAssets","type":"uint256"},{"internalType":"uint256","name":"totalSupply","type":"uint256"},{"internalType":"uint256","name":"convertToShares","type":"uint256"},{"internalType":"uint256","name":"convertToAssets","type":"uint256"},{"internalType":"uint256","name":"rewardsRate","type":"uint256"},{"internalType":"uint256","name":"supplyRate","type":"uint256"},{"internalType":"int256","name":"rebalanceDifference","type":"int256"},{"components":[{"internalType":"bool","name":"modeWithInterest","type":"bool"},{"internalType":"uint256","name":"supply","type":"uint256"},{"internalType":"uint256","name":"withdrawalLimit","type":"uint256"},{"internalType":"uint256","name":"lastUpdateTimestamp","type":"uint256"},{"internalType":"uint256","name":"expandPercent","type":"uint256"},{"internalType":"uint256","name":"expandDuration","type":"uint256"},{"internalType":"uint256","name":"baseWithdrawalLimit","type":"uint256"},{"internalType":"uint256","name":"withdrawableUntilLimit","type":"uint256"},{"internalType":"uint256","name":"withdrawable","type":"uint256"}],"internalType":"struct Structs.UserSupplyData","name":"liquidityUserSupplyData","type":"tuple"}],"internalType":"struct Structs.FTokenDetails","name":"fTokenDetails_","type":"tuple"}],"stateMutability":"view","type":"function"}]'


def get_data(chain: Chain):
    markets_data = []
    web3 = get_node(chain)
    lending_resolver_address = LENDING_RESOLVER.get(chain)
    if not lending_resolver_address:
        raise ValueError(f"Unsupported chain: {chain}")

    lending_resolver_contract = get_contract(lending_resolver_address, chain, web3=web3, abi=ABI_LENDING_RESOLVER)
    ftokens = lending_resolver_contract.functions.getAllFTokens().call()
    for ftoken in ftokens:
        ftoken_details = {}
        details = lending_resolver_contract.functions.getFTokenDetails(ftoken).call()
        ftoken_details['symbol'] = get_symbol(details[6], chain, web3=web3)
        ftoken_details['token'] = details[6]
        ftoken_details['fToken'] = ftoken

        markets_data.append(ftoken_details)

    suffixes = {
        Chain.ETHEREUM: '_ethInfo.ts',
        Chain.ARBITRUM: '_arb1Info.ts',
        Chain.BASE: '_baseInfo.ts',
    }
    dump(markets_data, 'fluid', suffixes[chain])

get_data(Chain.ETHEREUM)
get_data(Chain.ARBITRUM)
get_data(Chain.BASE)