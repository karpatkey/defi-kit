# DeFi Kit

[![Build Status](https://github.com/karpatkey/defi-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/karpatkey/defi-kit/actions/workflows/ci.yml)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

Permissions for [Zodiac Roles](https://github.com/gnosisguild/zodiac-modifier-roles) covering interactions with DeFi protocols

https://kit.karpatkey.com

## Getting started

You can use DeFi Kit as a TypeScript SDK or via a REST API.
Below you can find simple examples for both.
For an in-depth overview refer to the [docs](https://kit.karpatkey.com/learn).

### TypeScript SDK

```
yarn add defi-kit
```

```typescript
import { apply, allow } from "defi-kit"

const calls = await apply(roleKey, [allow.cowSwap.swap(tokenIn, tokenOut)], {
  address: rolesModAddress,
  mode: "extend",
})
```

### REST API

```typescript
const res = await fetch(
  "https://kit.karpatkey.com/api/v1/eth:<MOD>/<ROLE>/allow/cowswap/swap?sell=<TOKEN_IN>&buy=<TOKEN_OUT>"
)
const calls = await res.json()
```

## Contribute

Install all dependencies:

```
yarn
```

Fetch ABIs and generate types for the sdk package:

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

To run tests, you first need to install `anvil`, which comes with foundry. See [installation instructions](https://book.getfoundry.sh/getting-started/installation).

Then, you can run tests in watch mode using:

```
yarn test:watch
```

### Recipes

#### Add a new protocol to the SDK

1. Create folder named after the protocol you wanna add in sdk/src/protocols.
2. Create a index.ts file in that folder.
3. For every chain that the protocol supports export an object under the chain prefix, e.g.:
   ```typescript
   export const eth = {}
   export const gno = {}
   ```
4. For every action that the protocol support add a key to each of the chain exports, e.g.:

   ```typescript
   export const eth = {
     deposit: async () => [],
   }

   export const gno = {
     deposit: async () => [],
   }
   ```

5. In sdk/src/protocols/index.ts, register the new protocol adding it to the exports for all the chains that it supports, e.g.:

   ```typescript
   import * as newProtocol from "./newProtocol"

   export const eth = {
     ..., // existing entries
     newProtocol: newProtocol.eth,
   } satisfies Record<string, ProtocolActions>

   export const gno = {
     ..., // existing entries
     newProtocol: newProtocol.gno,
   } satisfies Record<string, ProtocolActions>
   ```

6. Implement the functions, adhering to the general API for that action type and returning an array of `Permission[]`. See following section for guidance.

Note: For the new protocol functions to become available in the SDK playground, the changes must first be published to npm as a new version of the _defi-kit_ package.

#### Implement an action function using the allow kit

1. Add entries for the contracts you want to allow calling to sdk/eth-sdk/config.ts. If there are multiple instances of the same contract, such as different pool instances, only add a single entry using any exemplary contract address, e.g.:
   ```typescript
   mainnet: {
     curve: {
       regularPool: "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
     }
   }
   ```
2. Run `yarn setup`. This will automatically fetch the ABI for the listed contracts. In case this fails, you will have to manually add the ABI json file to the respective location in sdk/eth-sdk/abis.
3. Use the typed allow kit that has been generated:

   ```typescript
   import { allow } from "zodiac-roles-sdk/kit"

   const permissions = allow.curve.regularPool.exchange()
   ```

   In case VSCode IntelliSense does not reflect the newly added contract entries, restart the TypeScript server by pressing cmd+shift+p and selecting "TypeScript: Restart TS Server".

Note that you don't _have_ to use typed allow kits but you can always also author permissions manually.

#### Test an action function using the test kit

All action functions should be covered with tests to make sure the returned permissions actually allow the desired protocol action and that the protocol action actually leads to the desired state.

1. Use the `applyPermissions` helper function to apply the action's permission to a test role that is prepared as part of the global test setup:

   ```typescript
   import { applyPermissions } from "../../../../../../test/helpers"
   import { eth } from "."

   await applyPermissions(
     Chain.eth,
     await eth.deposit({ market: "Core", targets: ["ETH", "USDC", "WETH"] })
   )
   ```

2. Use test kit to execute calls to any contract in eth-sdk/config.ts through the test role:

   ```typescript
   import { eth as kit } from "../../../test/kit"

   await expect(kit.asMember.aaveV3.poolCoreV3.supply(...args)).toBeAllowed()
   ```

3. Use the [custom jest matchers](sdk/test/setup-after-env.ts) to check on the transaction outcome:

   ```typescript
   import { eth as kit } from "../../../test/kit"

   await expect(kit.asMember.aaveV3.poolCoreV3.supply(...args)).not.toRevert()
   ```

#### Run specific tests

The `test:watch` script allows you to target specific test files rather than running the entire test suite:

```bash
yarn test:watch aave/v3/deposit
```

You can pass any substring of the file paths to the targeted test files. Then you can also use the jest watch cli to control which tests shall be run whenever saving changes.

#### Add a new protocol to the API

Once a protocol has been added to the SDK, a couple of extra steps are necessary to make it available also via the REST API.

1. Define the parameter schema for the protocol action. Create a schema file in the protocol folder (src/protocols/<name>/schema.ts) and add exports for every supported network and action:

   ```typescript
   export const eth = {
     deposit: z.object({ targets: z.enum(...).array() }),
   }

   export const gno = {
     deposit: z.object({ targets: z.enum(...).array() }),
   }
   ```

2. Register the protocol schema in sdk/src/protocols/schema.ts:

   ```typescript
   import * as newProtocol from "./newProtocol/schema"

   export const eth = {
     ..., // existing entries
     newProtocol: newProtocol.eth,
   } satisfies Record<string, ProtocolSchemas>

   export const gno = {
     ..., // existing entries
     newProtocol: newProtocol.gno,
   } satisfies Record<string, ProtocolSchemas>
   ```

3. Check that the new endpoints have been registered correctly, by opening https://localhost:3000/api-docs.

#### Update protocol information

We rely on information about each protocol for deriving types and configs. This information is stored in files with names starting with `_` that are automatically generated by Python scripts. You find all Python scripts in the [scripts](/scripts) directory.

All scripts are run as a nightly job in a Github [workflow](.github/workflows/nightly.yml).

To run a script locally you need to first go through some setup steps:

- Setup python env, e.g., using anaconda:
  ```bash
  conda create --name defi-kit python=3.1
  conda activate defi-kit
  python -m pip install --upgrade pip
  ```
- Install dependencies:

  ```bash
  cd scripts
  pip install -r requirements.txt
  ```

- Create a file scripts/.env with the following content:
  ```
  CONFIG_PATH=<ABSOLUTE_PATH_TO_CONFIG.JSON>
  ```
- Run any script inside the scripts folder using the following command:
  ```bash
  yarn run-script aave_v3.py
  ```
