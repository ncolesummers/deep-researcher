export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export class Logger {
  constructor(private component: string) {}

  debug(message: string, details: Record<string, unknown> = {}) {
    this._log(LogLevel.DEBUG, message, details);
  }

  info(message: string, details: Record<string, unknown> = {}) {
    this._log(LogLevel.INFO, message, details);
  }

  warn(message: string, details: Record<string, unknown> = {}) {
    this._log(LogLevel.WARN, message, details);
  }

  error(message: string, details: Record<string, unknown> = {}) {
    this._log(LogLevel.ERROR, message, details);
  }

  private _log(
    level: LogLevel,
    message: string,
    details: Record<string, unknown>
  ) {
    const logRecord = {
      timestamp: new Date().toISOString(),
      level,
      message,
      component: this.component,
      ...details,
    };

    // Using console methods that will be captured by OpenTelemetry
    if (level === LogLevel.ERROR) {
      console.error(JSON.stringify(logRecord));
    } else if (level === LogLevel.WARN) {
      console.warn(JSON.stringify(logRecord));
    } else {
      console.log(JSON.stringify(logRecord));
    }
  }
}
