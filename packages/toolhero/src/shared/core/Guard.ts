import { Result, ResultError } from "./Result";

export interface IGuardResult {
  succeeded: boolean;
  error?: ResultError;
}

export interface IGuardArgument {
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
  public static combinedFailures(results: Result<any>[]): Result<void> {
    for (const result of results) {
      if (result.isFailure) {
        return Result.fail<void>(result.error);
      }
    }
    return Result.ok<void>();
  }

  public static matchRegex(regex: RegExp, value: string): IGuardResult {
    if (value && value.match(regex)) {
      return {
        succeeded: true,
      };
    }
    return {
      succeeded: false,
      error: {
        code: "VALIDATION_FAILURE",
        message: `${value} is not a valid`,
      },
    };
  }
  public static combine(guardResults: IGuardResult[]): IGuardResult {
    for (const result of guardResults) {
      if (result.succeeded === false) return result;
    }

    return { succeeded: true };
  }

  public static greaterThan(
    minValue: number,
    actualValue: number
  ): IGuardResult {
    return actualValue > minValue
      ? { succeeded: true }
      : {
          succeeded: false,
          error: {
            code: "VALIDATION_FAILURE",
            message: `Number given {${actualValue}} is not greater than {${minValue}}`,
          },
        };
  }

  public static againstNaN(number: number, text: string): IGuardResult {
    return isNaN(number) !== true
      ? { succeeded: true }
      : {
          succeeded: false,
          error: {
            code: "VALIDATION_FAILURE",
            message: `${text} is not a valid number`,
          },
        };
  }

  public static againstNaNBulk(args: GuardArgumentCollection): IGuardResult {
    for (const arg of args) {
      const result = this.againstNaN(arg.argument, arg.argumentName);
      if (!result.succeeded) return result;
    }

    return { succeeded: true };
  }

  public static againstAtLeast(numChars: number, text: string): IGuardResult {
    return text.length >= numChars
      ? { succeeded: true }
      : {
          succeeded: false,
          error: {
            code: "VALIDATION_FAILURE",
            message: `Text is not at least ${numChars} chars.`,
          },
        };
  }

  public static againstAtMost(numChars: number, text: string): IGuardResult {
    return text.length <= numChars
      ? { succeeded: true }
      : {
          succeeded: false,
          error: {
            code: "VALIDATION_FAILURE",
            message: `Text is greater than ${numChars} chars.`,
          },
        };
  }

  public static againstNullOrUndefined(
    argument: any,
    argumentName: string
  ): IGuardResult {
    if (argument === null || argument === undefined) {
      return {
        succeeded: false,
        error: {
          code: "VALIDATION_FAILURE",
          message: `${argumentName} is required`,
        },
      };
    } else {
      return { succeeded: true };
    }
  }

  public static againstNullOrUndefinedBulk(
    args: GuardArgumentCollection
  ): IGuardResult {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(
        arg.argument,
        arg.argumentName
      );
      if (!result.succeeded) return result;
    }

    return { succeeded: true };
  }

  public static isOneOf(
    value: any,
    validValues: any[],
    argumentName: string
  ): IGuardResult {
    let isValid = false;
    for (const validValue of validValues) {
      if (value === validValue) {
        isValid = true;
      }
    }

    if (isValid) {
      return { succeeded: true };
    } else {
      return {
        succeeded: false,
        error: {
          code: "VALIDATION_FAILURE",
          message: `${argumentName} isn't oneOf the correct types in ${JSON.stringify(
            validValues
          )}. Got "${value}".`,
        },
      };
    }
  }

  public static againstEmpty(
    argument: any,
    argumentName: string
  ): IGuardResult {
    function isString(value: any): boolean {
      return typeof value === "string" || value instanceof String;
    }
    function isEmpty(value: any) {
      if (value === null || value === undefined) {
        return true;
      }
      if (isString(value) === true && (value as string).length === 0) {
        return true;
      }
      return false;
    }

    let _isEmpty = false;
    if (isString(argument)) {
      _isEmpty = isEmpty(argument);
    } else {
      _isEmpty = argument === null || argument === undefined;
    }
    if (_isEmpty === true) {
      return {
        succeeded: false,
        error: {
          code: "VALIDATION_FAILURE",
          message: `${argumentName} is empty`,
        },
      };
    }
    return { succeeded: true };
  }

  public static againstEmptyBulk(args: GuardArgumentCollection): IGuardResult {
    for (const arg of args) {
      const result = this.againstEmpty(arg.argument, arg.argumentName);
      if (!result.succeeded) return result;
    }

    return { succeeded: true };
  }

  public static inRange(params: {
    num: number;
    min: number;
    max: number;
    argumentName: string;
  }): IGuardResult {
    const { num, min, max, argumentName } = params;
    const isInRange = num >= min && num <= max;
    if (!isInRange) {
      return {
        succeeded: false,
        error: {
          code: "VALIDATION_FAILURE",
          message: `${argumentName} with value ${num} is not within range ${min} to ${max}.`,
        },
      };
    } else {
      return { succeeded: true };
    }
  }
}
