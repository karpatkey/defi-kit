/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 5000,
  globalSetup: "./test/global-setup.ts",
  setupFilesAfterEnv: ["./test/setup-after-env.ts"],
}
