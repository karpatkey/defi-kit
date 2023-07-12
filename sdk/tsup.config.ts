import { defineConfig } from "tsup"

export default defineConfig({
  name: "tsup",
  target: "node14",
  sourcemap: true,
  entry: ["./src/index.ts", "./src/eth.ts", "./src/gor.ts"],
  dts: {
    resolve: true,
  },
  noExternal: [
    "zodiac-roles-sdk/kit",
    "@dethcrypto/eth-sdk-client",
    ".dethcrypto/eth-sdk-client",
  ],
  external: ["zodiac-roles-sdk"],
})
