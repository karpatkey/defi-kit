import * as defiKitCore from "defi-kit"
import * as defiKitEth from "defi-kit/eth"
// import * as defiKitGor from "defi-kit/gor"

const AVAILABLE: Record<string, any> = {
  "defi-kit": defiKitCore,
  "defi-kit/eth": defiKitEth,
  //  "defi-kit/gor": defiKitGor,
}

type Exports = (name: string, value: any) => void
type Setter = (value: any) => void

export const System = {
  register(
    deps: string[],
    callback: (exports: Exports) => { setters: Setter[]; execute: () => void }
  ) {
    const { setters, execute } = callback(() => { })

    deps.forEach((dep, i) => {
      if (!(dep in AVAILABLE)) {
        const availableDeps = Object.keys(AVAILABLE)
          .map((name) => "  - `" + name + "`")
          .join("\n")
        throw new Error(
          `Package \`${dep}\` is not available in the playground. Only the following packages can be imported:\n${availableDeps}`
        )
      }
      setters[i](AVAILABLE[dep])
    })

    execute()
  },
}
