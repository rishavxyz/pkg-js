import log from "./log";

export enum ErrorType {
  ProcessError,
  ItemNotFound,
  CommandError,
  FlagError   ,
  TypeError
}

export interface Error {
  type: string;
  error: string;
  message?: string|undefined;
}

export default class error extends ErrorEvent {

  constructor(
    type: keyof typeof ErrorType,
    cause: string, message?: string
  ) {
    super(type, { error: cause, message });
  }

  static parse(error: Error): Error {
    return {
      type: error.type,
      error: error.error,
      message: error.message
    }
  }

  static show(errorObject: Error): void {
    const { error, message, type } = this.parse(errorObject)

    log("E", `${type}: ${error}`);
    message &&
    log(null, `Fix: ${message}`);
  }
}