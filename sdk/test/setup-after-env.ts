import { utils } from "ethers"
import { revertToBase } from "./snapshot"
import { Status } from "./types"
import { rolesAbi } from "zodiac-roles-sdk/."

global.afterAll(revertToBase)

declare global {
  namespace jest {
    interface Matchers<R> {
      toRevert(expectedReason?: string | RegExp): Promise<CustomMatcherResult>
      toBeAllowed(): Promise<CustomMatcherResult>
      toBeForbidden(
        status?: Status,
        info?: string
      ): Promise<CustomMatcherResult>
    }
  }
}

const iface = new utils.Interface(rolesAbi)

expect.extend({
  async toRevert(received: Promise<any>, expectedReason?: string | RegExp) {
    try {
      await received
      return {
        message: () => `Expected call to revert, but it didn't`,
        pass: false,
      }
    } catch (e: any) {
      if (!e.error?.error?.data) {
        throw e
      }
      const error = iface.parseError(e.error.error.data)

      // match reason against expectedReason
      const reason = `${error.name}(${error.args.join(", ")})`
      if (expectedReason !== undefined) {
        const isMatching =
          typeof expectedReason === "string"
            ? reason === expectedReason
            : expectedReason.test(reason)

        return {
          message: () =>
            `Expected call to revert with ${this.utils.printExpected(
              expectedReason
            )}, but it reverted with ${this.utils.printReceived(reason)}`,
          pass: isMatching,
        }
      }

      return {
        message: () =>
          `Expected call to not revert, but it reverted with ${this.utils.printReceived(
            reason
          )}`,
        pass: true,
      }
    }
  },

  /** Checks that the call passes the permission checks for the test role. Does not care whether or not the call reverts. */
  async toBeAllowed(received: Promise<any>) {
    try {
      await received
      return {
        message: () => `Expected transaction to not be allowed, but it is`,
        pass: true,
      }
    } catch (e: any) {
      if (!e.error?.error?.data) {
        throw e
      }
      const error = iface.parseError(e.error.error.data)

      if (error.signature !== "ConditionViolation(uint8,bytes32)") {
        console.warn(error)

        // if we get here, it's not a permission error
        return {
          message: () =>
            `Expected transaction to not be allowed, but it is failing with an unexpected error (see up)`,
          pass: true,
        }
      }

      const [receivedStatus] = error.args

      return {
        message: () =>
          `Expected transaction to be allowed, but it is forbidden with status ${this.utils.printReceived(
            Status[receivedStatus]
          )}`,
        pass: false,
      }
    }
  },

  /** Checks that the call does not pass the permission checks for the test role. Does not care whether or not the call reverts. */
  async toBeForbidden(received: Promise<any>, status?: Status, info?: string) {
    try {
      await received
      return {
        message: () => "Expected transaction to be forbidden but it passed",
        pass: false,
      }
    } catch (e: any) {
      if (!e.error?.error?.data) {
        throw e
      }
      const error = iface.parseError(e.error.error.data)

      if (error.signature !== "ConditionViolation(uint8,bytes32)") {
        // if we get here, it's not a permission error
        console.warn(error)

        return {
          message: () =>
            "Expected transaction to be forbidden but it is failing with an unexpected error (see up)",
          pass: false,
        }
      }

      const [receivedStatus, receivedInfo] = error.args

      if (status !== undefined) {
        if (receivedStatus !== status) {
          return {
            message: () =>
              `Expected transaction to be forbidden with status ${this.utils.printExpected(
                Status[status]
              )} but status is ${this.utils.printReceived(
                Status[receivedStatus]
              )}`,
            pass: false,
          }
        }
      }

      if (info) {
        if (receivedInfo !== info) {
          return {
            message: () =>
              `Expected transaction to be forbidden with info ${this.utils.printExpected(
                info
              )} but info is ${this.utils.printReceived(receivedInfo)}`,
            pass: false,
          }
        } else {
          return {
            message: () =>
              `Expected transaction to be forbidden with info ${this.utils.printExpected(
                info
              )} but it did`,
            pass: true,
          }
        }
      }

      let details = ""
      if (status !== undefined)
        details += ` with status ${this.utils.printExpected(Status[status])}`
      if (info !== undefined)
        details += ` (info: ${this.utils.printExpected(info)})`

      return {
        message: () =>
          `Expected transaction to not be forbidden${details}, but it was`,
        pass: true,
      }
    }
  },
})
