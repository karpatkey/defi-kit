import { defineConfig } from "tsup"

export default defineConfig({
  name: "tsup",
  target: "node14",
  sourcemap: true,
  entry: ["./src/index.ts", "./src/eth.ts"],
  dts: {
    resolve: true,
  },
})
