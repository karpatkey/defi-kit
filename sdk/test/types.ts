export enum Status {
  Ok,
  /// Role not allowed to delegate call to target address
  DelegateCallNotAllowed,
  /// Role not allowed to call target address
  TargetAddressNotAllowed,
  /// Role not allowed to call this function on target address
  FunctionNotAllowed,
  /// Role not allowed to send to target address
  SendNotAllowed,
  /// Or conition not met
  OrViolation,
  /// Nor conition not met
  NorViolation,
  /// Parameter value is not equal to allowed
  ParameterNotAllowed,
  /// Parameter value less than allowed
  ParameterLessThanAllowed,
  /// Parameter value greater than maximum allowed by role
  ParameterGreaterThanAllowed,
  /// Parameter value does not match
  ParameterNotAMatch,
  /// Array elements do not meet allowed criteria for every element
  NotEveryArrayElementPasses,
  /// Array elements do not meet allowed criteria for at least one element
  NoArrayElementPasses,
  /// Parameter value not a subset of allowed
  ParameterNotSubsetOfAllowed,
  /// Bitmask exceeded value length
  BitmaskOverflow,
  /// Bitmask not an allowed value
  BitmaskNotAllowed,
  CustomConditionViolation,
  AllowanceExceeded,
  CallAllowanceExceeded,
  EtherAllowanceExceeded,
}

// optionally add a type declaration, e.g. it enables autocompletion in IDEs
declare module "expect" {
  interface AsymmetricMatchers {
    toBeForbidden(received: Promise<any>, status?: Status): void
  }
  interface Matchers<R> {
    toBeForbidden(received: Promise<any>, status?: Status): R
  }
}
