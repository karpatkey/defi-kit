import ethPools from "./pools/eth"

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never

export type EthPool = ArrayElement<typeof ethPools>
export type Pool = EthPool

export type EthToken = EthPool["tokens"][number]
export type Token = EthToken
