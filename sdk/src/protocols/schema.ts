import * as curve from "./curve/schema"
import * as cowswap from "./cowswap/schema"

// group all protocols schemas by chain

export const eth = {
  curve: curve.eth,
}

export const gor = {
  cowswap: cowswap.gor,
}
