import { defineConfig } from "tsup"

export default defineConfig({
  name: "tsup",
  target: "node14",
  sourcemap: true,
  entry: ["./src/index.ts", "./src/eth.ts", "./src/gno.ts", "./src/arb1.ts"],
  dts: {
    resolve: true,
  },
  noExternal: [
    "zodiac-roles-sdk/kit",
    "@gnosis-guild/eth-sdk-client",
    ".gnosis-guild/eth-sdk-client",
  ],
  external: ["zodiac-roles-sdk"],
})
