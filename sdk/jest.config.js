/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 60000,
  globalSetup: "./test/global-setup.ts",
  setupFiles: ["./test/stub-roles-subgraph.ts"],
  setupFilesAfterEnv: ["./test/setup-after-env.ts"],
}
