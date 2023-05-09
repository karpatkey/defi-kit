import { defineConfig } from "tsup"

export default defineConfig({
  name: "tsup",
  target: "node14",
  sourcemap: true,
  dts: {
    resolve: true,
    entry: "./src/index.ts",
  },
  // noExternal: ["@dethcrypto/eth-sdk"],
})
