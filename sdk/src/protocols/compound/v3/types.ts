import comets from "./_info"

export type Comet = (typeof comets)[number]
export type Collateral = (typeof comets)[number]["collateralTokens"][number]
export type BorrowToken = (typeof comets)[number]["borrowToken"]
export type Token = Collateral | BorrowToken
