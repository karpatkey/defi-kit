import ethInfo from "./_ethInfo"

export type EthToken = (typeof ethInfo)[number]

export const FEES = ["0.01%", "0.05%", "0.3%", "1%"] as const;

export type Fee = (typeof FEES)[number]
