import comets from "./_comets"

export type Comet = (typeof comets)[number]
export type Collaterals = (typeof comets)[number]['collateralTokens'][number]
