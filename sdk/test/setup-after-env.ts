import { revertToBase } from "./snapshot"

global.afterEach(revertToBase)
