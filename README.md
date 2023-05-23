# DeFi Permission Presets

Permission presets for [Zodiac Roles](https://github.com/gnosis/zodiac-modifier-roles) covering interactions with DeFi protocols.

## How to use

### npm package

```
yarn add defi-presets
```

```typescript
import { applyPermissions, allow } from "defi-presets"

const calls = await applyPermissions(
  roleId,
  [allow.cowswap.swap(tokenIn, tokenOut)],
  {}
)
```

### REST API

```typescript
const res = await fetch(
  "https://presets.karpatkey.com/api/v1/allow/cowswap/swap?mod=<ADDRESS>"
)
const calls = await res.json()
```

#### Routes

```
GET https://presets.karpatkey.com/api/v1/<chain>:<address>/<role>/<allow|revoke>/<protocol>/<action>?<query>
```

- `chain`: chain short name (see [official list](https://github.com/ethereum-lists/chains))
- `address`: address of the Roles mod
- `role`: ID of the role to update
- `protocol`: protocol name
- `action`: `swap`/`lp`/`stake`/`lend`/`borrow`
- `query`: action specific query parameters

#### Responses

All requests have a JSON response of the same schema:

```json
{
  "version": "1.0",
  "chainId": "1",
  "meta": {
    "name": "",
    "description": "",
    "txBuilderVersion": "1.8.0"
  },
  "createdAt": 1683187179279,
  "transactions": [
    {
      "to": "0x...",
      "data": "0x...",
      "value": "0"
    }
  ]
}
```

This JSON can be uploaded to the Safe Transaction Builder app for execution.

#### Actions

##### `deposit`

Deposit and withdraw liquidity from AMM pools or money markets

##### `stake`

Stake LP tokens

##### `borrow`

Borrow assets against collateral on money markets

#### Protocols

##### `curve`

Supported actions: `deposit`, `stake`

##### `compound`

Supported actions: `deposit`, `borrow`

## Contribute

Install all dependencies:

```
yarn
```

Fetch ABIs and generate types for sdk:

```
yarn setup
```

Start app dev server and watch sources for changes:

```
yarn dev
```

Build sdk and app:

```
yarn build
```
