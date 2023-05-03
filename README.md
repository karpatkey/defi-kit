# DeFi Permission Presets

Permission presets for [Zodiac Roles](https://github.com/gnosis/zodiac-modifier-roles) covering interactions with DeFi protocols.

## How to use

### npm package

```
yarn add defi-presets
```

```typescript
import { apply, allow } from "defi-presets"

const calls = await apply(rolesModAddress, roleId, [
  allow.cowswap.swap(tokenIn, tokenOut),
])
```

### REST API

```typescript
const res = await fetch(
  "https://presets.karpatkey.com/api/v1/allow/cowswap/swap?mod=<ADDRESS>"
)
const calls = await res.json()
```

## Contribute

Install all dependencies:

```
yarn
```

Fetch ABIs and generate types for sdk:

```
yarn prepare
```

Start app dev server and watch sources for changes:

```
yarn dev
```

Build sdk and app:

```
yarn build
```
