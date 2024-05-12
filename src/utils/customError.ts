import log from "./log";

export class CustomError {
  constructor(type: string, cause: string, message?: string) {
    log("E",
      [ type, ': ', cause
      , message && '\n', message
      ].join('')
    );
  }
}

export class TypeError extends CustomError {
  constructor(cause: string, message?: string) {
    super('TypeError', cause, message);
  }
}

export class SyntaxError extends CustomError {
  constructor(cause: string, message?: string) {
    super('SyntaxError', cause, message);
  }
}

export class ProcessError extends CustomError {
  constructor(cause: string, message?: string) {
    super('ProcessError', cause, message);
  }
}

export class OptionError extends CustomError {
  constructor(cause: string, message?: string) {
    super('OptionError', cause, message);
  }
}