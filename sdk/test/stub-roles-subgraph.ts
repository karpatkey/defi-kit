/**
 * The Roles SDK resolves the *current* on-chain role state through Gnosis
 * Guild's hosted Subsquid endpoint. Two call sites reach it on every
 * `applyPermissions()`:
 *
 *   - `fetchRole` in `src/apply.ts`
 *   - `fetchRolesModConfig` inside `planApplyRole` (license enforcement)
 *
 * That endpoint currently answers with an nginx 404 page, and
 * `zodiac-roles-deployments` calls `res.json()` without checking the status,
 * so the HTML surfaces as `SyntaxError: Unexpected token '<'` and every test
 * that applies permissions fails. See the upstream issue linked in the PR.
 *
 * Stubbing it here is faithful rather than a workaround: the tests deploy a
 * fresh Roles mod onto an ephemeral anvil fork (see `test/rolesMod.ts`), so it
 * is not indexed by the subgraph and `null` is the correct answer for both
 * queries. `fetchRole` then returns null, `fetchRolesModConfig` returns null,
 * the license branch is skipped, and `planApplyRole` falls back to the
 * `currentTargets`/`currentAnnotations` the test helper already passes.
 *
 * Only this one URL is intercepted; every other request goes to the network
 * untouched. Once the endpoint is reachable again this file can be deleted
 * along with its `setupFiles` entry in `jest.config.js`.
 */
const SQD_URL = "https://gnosisguild.squids.live/roles:production/api/graphql"

const EMPTY_SUBGRAPH_RESPONSE = {
  data: { role: null, rolesModifier: null },
}

const realFetch = globalThis.fetch

globalThis.fetch = (async (input: any, init?: any) => {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
      ? input.href
      : input?.url

  if (url === SQD_URL) {
    return new Response(JSON.stringify(EMPTY_SUBGRAPH_RESPONSE), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }

  return realFetch(input, init)
}) as typeof globalThis.fetch
