// Starts one anvil fork per chain in TEST_CHAINS (default: all of them).
//
// Each test shard only exercises a subset of chains, but every shard used to
// start all five forks, so a 16-shard matrix opened up to 80 archive-syncing
// forks against the same RPC. Scoping the forks to what a shard actually needs
// is the difference between 1 and 5 upstream connections per job.
import { spawn } from "node:child_process"

const FORKS = {
  eth: {
    port: 8545,
    rpc: process.env.ETH_FORK_RPC || "https://ethereum-rpc.publicnode.com",
  },
  arb1: {
    port: 8546,
    rpc: process.env.ARB1_FORK_RPC || "https://arb1.arbitrum.io/rpc",
  },
  gno: {
    port: 8547,
    rpc: process.env.GNO_FORK_RPC || "https://rpc.gnosischain.com/",
  },
  oeth: {
    port: 8548,
    rpc: process.env.OETH_FORK_RPC || "https://optimism-rpc.publicnode.com",
  },
  base: {
    port: 8549,
    rpc: process.env.BASE_FORK_RPC || "https://base-rpc.publicnode.com",
  },
}

const chains = (process.env.TEST_CHAINS || Object.keys(FORKS).join(","))
  .split(",")
  .map((c) => c.trim())
  .filter(Boolean)

const unknown = chains.filter((c) => !(c in FORKS))
if (unknown.length) {
  console.error(`TEST_CHAINS: unknown chain(s): ${unknown.join(", ")}`)
  process.exit(1)
}

console.log(`Starting anvil forks: ${chains.join(", ")}`)

const children = chains.map((chain) => {
  const { port, rpc } = FORKS[chain]
  const child = spawn(
    "anvil",
    ["--silent", "--fork-url", rpc, "-p", String(port)],
    { stdio: "inherit", shell: process.platform === "win32" }
  )
  child.on("exit", (code, signal) => {
    if (!shuttingDown) {
      console.error(`anvil(${chain}) exited: code=${code} signal=${signal}`)
      shutdown(code ?? 1)
    }
  })
  return child
})

let shuttingDown = false
function shutdown(code) {
  if (shuttingDown) return
  shuttingDown = true
  for (const c of children) c.kill("SIGTERM")
  process.exit(code)
}
process.on("SIGINT", () => shutdown(0))
process.on("SIGTERM", () => shutdown(0))
