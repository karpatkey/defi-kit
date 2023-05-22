import mainnetPools from "./pools/mainnet"

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never

export type MainnetPool = ArrayElement<typeof mainnetPools>

export type Pool = MainnetPool
