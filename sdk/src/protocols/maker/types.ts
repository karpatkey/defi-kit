import gems from "./_info"

export type Gem = (typeof gems)[number]
export type Cdp = {
  id: number
  ilkDescription: Gem["ilkDescription"]
}
